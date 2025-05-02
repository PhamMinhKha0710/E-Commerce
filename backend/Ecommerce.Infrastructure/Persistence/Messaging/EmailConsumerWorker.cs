using Ecommerce.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;
using System.Net.Mail;
using System.Text;
using System.Text.Json;

namespace Ecommerce.Infrastructure.Messaging
{
    public class EmailConsumerWorker : BackgroundService
    {
        private readonly string _hostName;
        private readonly string _queueName;
        private readonly IConnection _connection;
        private readonly IChannel _channel;
        private readonly ILogger<EmailConsumerWorker> _logger;
        private readonly IEmailService _emailService;
        private readonly List<string> _validQueues;

        public EmailConsumerWorker(IConfiguration configuration, ILogger<EmailConsumerWorker> logger, IEmailService emailService)
        {
            _logger = logger;
            _emailService = emailService;
            _hostName = configuration["RabbitMQ:HostName"] ?? "localhost";
            _queueName = configuration.GetSection("RabbitMQ:Queues")
                .Get<List<QueueConfig>>()
                ?.FirstOrDefault(q => q.Name == "email_queue")?.Name ?? "email_queue";
            _validQueues = configuration.GetSection("RabbitMQ:Queues")
                .Get<List<QueueConfig>>()
                ?.Select(q => q.Name)
                .ToList() ?? new List<string>();

            if (!_validQueues.Contains(_queueName))
            {
                _logger.LogError("Queue {Queue} is not defined in configuration", _queueName);
                throw new ArgumentException($"Queue {_queueName} is not defined in configuration");
            }

            var factory = new ConnectionFactory
            {
                HostName = _hostName,
                UserName = configuration["RabbitMQ:UserName"] ?? "guest",
                Password = configuration["RabbitMQ:Password"] ?? "guest",
                VirtualHost = configuration["RabbitMQ:VirtualHost"] ?? "/",
                Port = configuration.GetValue<int>("RabbitMQ:Port", 5672),
                ClientProvidedName = configuration["RabbitMQ:ClientProvidedName"]?.Replace("payment-producer", "email-consumer") ?? "app:ecommerce component:email-consumer",
                AutomaticRecoveryEnabled = configuration.GetValue<bool>("RabbitMQ:AutomaticRecoveryEnabled", true),
                NetworkRecoveryInterval = TimeSpan.FromSeconds(configuration.GetValue<int>("RabbitMQ:NetworkRecoveryIntervalSeconds", 10))
            };

            try
            {
                _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
                _channel = _connection.CreateChannelAsync().GetAwaiter().GetResult();

                // Cấu hình Dead Letter Queue
                var arguments = new Dictionary<string, object>
                {
                    { "x-dead-letter-exchange", "" },
                    { "x-dead-letter-routing-key", "email_dead_letter_queue" }
                };
                _channel.QueueDeclareAsync(queue: _queueName, durable: true, exclusive: false, autoDelete: false, arguments: arguments)
                    .GetAwaiter().GetResult();
                _channel.QueueDeclareAsync(queue: "email_dead_letter_queue", durable: true, exclusive: false, autoDelete: false, arguments: null)
                    .GetAwaiter().GetResult();

                _logger.LogInformation("Connected to RabbitMQ at {HostName}, VirtualHost: {VirtualHost}, Consuming queue: {Queue}", _hostName, factory.VirtualHost, _queueName);
            }
            catch (BrokerUnreachableException ex)
            {
                _logger.LogError(ex, "Failed to connect to RabbitMQ at {HostName}, VirtualHost: {VirtualHost}", _hostName, factory.VirtualHost);
                throw;
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                int retryCount = ea.BasicProperties.Headers != null && ea.BasicProperties.Headers.ContainsKey("retry-count")
                    ? Convert.ToInt32(ea.BasicProperties.Headers["retry-count"])
                    : 0;
                const int maxRetries = 3;

                try
                {
                    var message = Encoding.UTF8.GetString(ea.Body.ToArray());
                    var emailData = JsonSerializer.Deserialize<PaymentEmailData>(message);

                    await _emailService.SendPaymentConfirmationEmailAsync(emailData.Email, emailData.Amount, emailData.OrderId);
                    _logger.LogInformation("Successfully sent payment confirmation email to {Email}, OrderId: {OrderId}", emailData.Email, emailData.OrderId);

                    await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
                }
                catch (SmtpException ex) when (IsTransientSmtpError(ex))
                {
                    _logger.LogWarning(ex, "Transient SMTP error processing email from queue {Queue}, RetryCount: {RetryCount}", _queueName, retryCount);

                    if (retryCount >= maxRetries)
                    {
                        var dlqProperties = new BasicProperties();
                        await _channel.BasicPublishAsync(exchange: "", routingKey: "email_dead_letter_queue", mandatory: false, basicProperties: dlqProperties, body: ea.Body);
                        await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
                        _logger.LogWarning("Moved message to email_dead_letter_queue after {MaxRetries} retries", maxRetries);
                    }
                    else
                    {
                        
                        var newProperties = new BasicProperties();
                        newProperties.Headers = ea.BasicProperties.Headers != null
                            ? new Dictionary<string, object>(ea.BasicProperties.Headers)
                            : new Dictionary<string, object>();
                        newProperties.Headers["retry-count"] = retryCount + 1;

                        await _channel.BasicPublishAsync(exchange: "", routingKey: _queueName, mandatory: false, basicProperties: newProperties, body: ea.Body);
                        await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false); // Ack message gốc để tránh duplicate
                        _logger.LogInformation("Requeued message to {Queue} with retry-count: {RetryCount}", _queueName, retryCount + 1);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Permanent error processing email from queue {Queue}, moving to DLQ", _queueName);
                    var dlqProperties = new BasicProperties();
                    await _channel.BasicPublishAsync(exchange: "", routingKey: "email_dead_letter_queue", mandatory: false, basicProperties: dlqProperties, body: ea.Body);
                    await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false);
                    _logger.LogWarning("Moved message to email_dead_letter_queue due to permanent error");
                }
            };

            try
            {
                await _channel.BasicConsumeAsync(queue: _queueName, autoAck: false, consumer: consumer);
                _logger.LogInformation("Started consuming from queue {Queue}", _queueName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting consumer for queue {Queue}", _queueName);
                throw;
            }

            await Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            try
            {
                await _channel.CloseAsync();
                await _connection.CloseAsync();
                await _channel.DisposeAsync();
                await _connection.DisposeAsync();
                _logger.LogInformation("RabbitMQ consumer stopped for queue {Queue}", _queueName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error stopping RabbitMQ consumer for queue {Queue}", _queueName);
            }
            await base.StopAsync(cancellationToken);
        }

        private bool IsTransientSmtpError(SmtpException ex)
        {
            return ex.Message.Contains("timeout", StringComparison.OrdinalIgnoreCase) ||
                   ex.Message.Contains("connection refused", StringComparison.OrdinalIgnoreCase) ||
                   ex.Message.Contains("service unavailable", StringComparison.OrdinalIgnoreCase);
        }

        private class QueueConfig
        {
            public string Name { get; set; }
            public string Description { get; set; }
        }

        private class PaymentEmailData
        {
            public string Email { get; set; }
            public decimal Amount { get; set; }
            public string OrderId { get; set; }
        }
    }
}