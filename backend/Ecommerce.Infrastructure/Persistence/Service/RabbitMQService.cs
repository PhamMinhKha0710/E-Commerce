using Ecommerce.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Exceptions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Ecommerce.Infrastructure.Messaging
{
    public class RabbitMQService : IRabbitMQService, IAsyncDisposable
    {
        private readonly IConnection _connection;
        private IChannel _channel;
        private readonly ILogger<RabbitMQService> _logger;
        private readonly string _hostName;
        private readonly List<string> _validQueues;
        private readonly Dictionary<string, string> _queueDeadLetterMap;
        private readonly ConnectionFactory _factory;
        private bool _disposed;

        public RabbitMQService(IConfiguration configuration, ILogger<RabbitMQService> logger)
        {
            _logger = logger;
            _hostName = configuration["RabbitMQ:HostName"] ?? "localhost";
            _validQueues = configuration.GetSection("RabbitMQ:Queues")
                .Get<List<QueueConfig>>()
                ?.Select(q => q.Name)
                .ToList() ?? new List<string>();

            _queueDeadLetterMap = configuration.GetSection("RabbitMQ:Queues")
                .Get<List<QueueConfig>>()
                ?.Where(q => !string.IsNullOrEmpty(q.DeadLetterQueue))
                .ToDictionary(q => q.Name, q => q.DeadLetterQueue) ?? new Dictionary<string, string>();

            _factory = new ConnectionFactory
            {
                HostName = _hostName,
                UserName = configuration["RabbitMQ:UserName"] ?? "guest",
                Password = configuration["RabbitMQ:Password"] ?? "guest",
                VirtualHost = configuration["RabbitMQ:VirtualHost"] ?? "/",
                Port = configuration.GetValue<int>("RabbitMQ:Port", 5672),
                ClientProvidedName = configuration["RabbitMQ:ClientProvidedName"] ?? "app:ecommerce component:payment-producer",
                AutomaticRecoveryEnabled = configuration.GetValue<bool>("RabbitMQ:AutomaticRecoveryEnabled", true),
                NetworkRecoveryInterval = TimeSpan.FromSeconds(configuration.GetValue<int>("RabbitMQ:NetworkRecoveryIntervalSeconds", 10))
            };

            try
            {
                _connection = _factory.CreateConnectionAsync().GetAwaiter().GetResult();
                _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();
                _logger.LogInformation("Connected to RabbitMQ at {HostName}, VirtualHost: {VirtualHost}", _hostName, _factory.VirtualHost);
            }
            catch (BrokerUnreachableException ex)
            {
                _logger.LogError(ex, "Failed to connect to RabbitMQ at {HostName}, VirtualHost: {VirtualHost}", _hostName, _factory.VirtualHost);
                throw;
            }
        }

        private async Task EnsureChannelAsync()
        {
            if (_channel == null || !_channel.IsOpen)
            {
                _channel = await _connection.CreateChannelAsync();
            }
        }

        public async Task PublishMessageAsync(string queue, string message)
        {
            if (!_validQueues.Contains(queue))
            {
                _logger.LogError("Queue {Queue} is not defined in configuration", queue);
                throw new ArgumentException($"Queue {queue} is not defined in configuration");
            }

            int retryCount = 0;
            const int maxRetries = 3;
            while (retryCount < maxRetries)
            {
                try
                {
                    await EnsureChannelAsync();

                    // Chọn dead-letter queue dựa trên queue
                    string deadLetterQueue = _queueDeadLetterMap.ContainsKey(queue)
                        ? _queueDeadLetterMap[queue]
                        : $"{queue}_dead_letter_queue";

                    var arguments = new Dictionary<string, object>
                    {
                        { "x-dead-letter-exchange", "" },
                        { "x-dead-letter-routing-key", deadLetterQueue },
                        { "x-queue-type", "classic" }
                    };

                    // Kiểm tra và khai báo queue
                    bool queueExists = false;
                    try
                    {
                        await _channel.QueueDeclarePassiveAsync(queue);
                        queueExists = true;
                    }
                    catch (OperationInterruptedException ex) when (ex.ShutdownReason.ReplyCode == 404)
                    {
                        // Tái tạo kênh vì lỗi 404 có thể đóng kênh
                        await EnsureChannelAsync();
                        // Khai báo dead-letter queue trước
                        await _channel.QueueDeclareAsync(queue: deadLetterQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                        // Khai báo queue chính
                        await _channel.QueueDeclareAsync(queue: queue, durable: true, exclusive: false, autoDelete: false, arguments: arguments);
                    }

                    var body = Encoding.UTF8.GetBytes(message);
                    var properties = new BasicProperties { Persistent = true };
                    await _channel.BasicPublishAsync(exchange: "", routingKey: queue, mandatory: false, basicProperties: properties, body: body);
                    return;
                }
                catch (Exception ex)
                {
                    retryCount++;
                    _logger.LogWarning(ex, "Attempt {RetryCount} failed to publish message to queue {Queue}", retryCount, queue);
                    if (retryCount >= maxRetries)
                    {
                        _logger.LogError(ex, "Failed to publish message to queue {Queue} after {MaxRetries} attempts", queue, maxRetries);
                        throw;
                    }
                    // Tái tạo kênh trước khi thử lại
                    _channel = null;
                    await Task.Delay(1000 * retryCount);
                }
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_disposed) return;
            _disposed = true;

            try
            {
                if (_channel != null && _channel.IsOpen)
                    await _channel.CloseAsync();
                if (_connection != null && _connection.IsOpen)
                    await _connection.CloseAsync();
                if (_channel != null)
                    await _channel.DisposeAsync();
                if (_connection != null)
                    await _connection.DisposeAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disposing RabbitMQ resources");
            }
        }

        private class QueueConfig
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string DeadLetterQueue { get; set; }
        }
    }
}