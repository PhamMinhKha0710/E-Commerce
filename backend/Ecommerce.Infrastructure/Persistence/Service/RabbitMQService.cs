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
        private readonly IChannel _channel;
        private readonly ILogger<RabbitMQService> _logger;
        private readonly string _hostName;
        private readonly List<string> _validQueues;
        private bool _disposed;

        public RabbitMQService(IConfiguration configuration, ILogger<RabbitMQService> logger)
        {
            _logger = logger;
            _hostName = configuration["RabbitMQ:HostName"] ?? "localhost";
            _validQueues = configuration.GetSection("RabbitMQ:Queues")
                .Get<List<QueueConfig>>()
                ?.Select(q => q.Name)
                .ToList() ?? new List<string>();

            var factory = new ConnectionFactory
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
                _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
                _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();
                _logger.LogInformation("Connected to RabbitMQ at {HostName}, VirtualHost: {VirtualHost}", _hostName, factory.VirtualHost);
            }
            catch (BrokerUnreachableException ex)
            {
                _logger.LogError(ex, "Failed to connect to RabbitMQ at {HostName}, VirtualHost: {VirtualHost}", _hostName, factory.VirtualHost);
                throw;
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
                    var arguments = new Dictionary<string, object>
                    {
                        { "x-dead-letter-exchange", "" }, // cấu hình giống với giao diện ở đây
                        { "x-dead-letter-routing-key", "email_dead_letter_queue" }, 
                        { "x-queue-type", "classic" } 
                    };
                    await _channel.QueueDeclareAsync(queue: queue, durable: true, exclusive: false, autoDelete: false, arguments: arguments);
                    var body = Encoding.UTF8.GetBytes(message);
                    var properties = new BasicProperties { Persistent = true };
                    await _channel.BasicPublishAsync(exchange: "", routingKey: queue, mandatory: false, basicProperties: properties, body: body);
                    _logger.LogInformation("Published message to queue {Queue}", queue);
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
                    await Task.Delay(1000 * retryCount); // Delay tăng dần: 1s, 2s, 3s
                }
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_disposed) return;
            _disposed = true;

            try
            {
                await _channel.CloseAsync();
                await _connection.CloseAsync();
                await _channel.DisposeAsync();
                await _connection.DisposeAsync();
                _logger.LogInformation("RabbitMQ connection and channel disposed");
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
        }
    }
}