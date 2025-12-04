using System.Text.Json;
using Ecommerce.Application.Command;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler;

public class ProcessPaymentCallbackCommandHandler : IRequestHandler<ProcessPaymentCallbackCommand, VnPaymentResponseDto>
{
    private readonly IPaymentService _paymentService;
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IRabbitMQService _rabbitMQService;
    private readonly ILogger<ProcessPaymentCallbackCommandHandler> _logger;
    private readonly string _emailQueueName;

    public ProcessPaymentCallbackCommandHandler(
        IPaymentService paymentService,
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository,
        IRabbitMQService rabbitMQService,
        IConfiguration configuration,
        ILogger<ProcessPaymentCallbackCommandHandler> logger)
    {
        _paymentService = paymentService;
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _rabbitMQService = rabbitMQService;
        _logger = logger;
        _emailQueueName = configuration.GetSection("RabbitMQ:Queues")
            .Get<List<QueueConfig>>()
            ?.FirstOrDefault(q => q.Name == "email_queue")?.Name ?? "email_queue";
    }

    public async Task<VnPaymentResponseDto> Handle(ProcessPaymentCallbackCommand request, CancellationToken cancellationToken)
    {
        var response = await _paymentService.ProcessPaymentCallback(request.Query);
        if (!response.Success)
        {
            _logger.LogWarning("Invalid signature for VnPay callback.");
            return response;
        }

        var payment = await _paymentRepository.GetPaymentByTransactionIdAsync(response.OrderId);
        if (payment == null)
        {
            var payments = await _paymentRepository.GetPaymentsByOrderIdAsync(int.Parse(response.OrderId));
            payment = payments?.OrderByDescending(p => p.CreatedAt).FirstOrDefault(p => p.PaymentStatus == "Pending");
            if (payment == null)
            {
                _logger.LogWarning($"No payment found for OrderId: {response.OrderId}");
                return response;
            }
        }

        var order = await _orderRepository.GetOrderByIdAsync(payment.ShopOrderId);
        if (order == null)
        {
            _logger.LogWarning($"Order not found for ShopOrderId: {payment.ShopOrderId}");
            return response;
        }

        var hasCompletedPayment = order.Payments.Any(p => p.PaymentStatus == "Completed");
        if (hasCompletedPayment)
        {
            _logger.LogWarning($"Order {order.OrderNumber} already has a completed payment.");
            return response;
        }

        return await _orderRepository.ExecuteInTransactionAsync<VnPaymentResponseDto>(async () =>
        {
            payment.TransactionId = response.TransactionId;
            payment.PaymentStatus = response.VnPayResponseCode == "00" ? "Completed" : "Failed";
            payment.ResponseCode = response.VnPayResponseCode;
            payment.ResponseMessage = response.OrderDescription;
            payment.SecureHash = response.Token;
            payment.UpdatedAt = DateTime.UtcNow;

            if (response.VnPayResponseCode == "00")
            {
                var confirmedStatus = await _orderRepository.GetOrderStatusByNameAsync("Confirmed");
                if (confirmedStatus != null)
                {
                    order.OrderStatusHistories ??= new List<OrderStatusHistory>();
                    order.OrderStatusHistories.Add(new OrderStatusHistory 
                    { 
                        OrderStatusId = confirmedStatus.Id,
                        CreateAt = DateTime.UtcNow // QUAN TRỌNG: Set CreateAt để OrderByDescending hoạt động đúng
                    });
                }
            }

            await _paymentRepository.UpdatePaymentAsync(payment);
            await _orderRepository.UpdateOrderAsync(order);

            // Ghi log
            await _paymentRepository.CreatePaymentLogAsync(new PaymentLog
            {
                PaymentId = payment.Id,
                EventType = "CallbackProcessed",
                Message = $"Payment for order {order.OrderNumber} processed with status {payment.PaymentStatus}",
                Data = JsonSerializer.Serialize(response),
                CreatedAt = DateTime.UtcNow
            });

            // Gửi message vào email_queue sau khi cập nhật giao dịch
            if (response.VnPayResponseCode == "00")
            {
                // var email = order.User?.Email;
                var email = await _orderRepository.GetUserEmailByShopOrderIdAsync(int.Parse(response.OrderId));
                Console.WriteLine($"Dmmmmmmmmmm tao la {email}");
                if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
                {
                    email = "nguyenngoctieptn@gmail.com"; // Email mặc định
                    _logger.LogWarning("Order {OrderNumber} has invalid or missing user email, using default: {Email}", order.OrderNumber, email);
                }

                try
                {
                    var emailMessage = new PaymentEmailData
                    {
                        Email = email,
                        Amount = payment.Amount,
                        OrderId = order.OrderNumber
                    };
                    var messageJson = JsonSerializer.Serialize(emailMessage);
                    await _rabbitMQService.PublishMessageAsync(_emailQueueName, messageJson);
                    _logger.LogInformation("Published payment confirmation message to {Queue} for {Email}, OrderId: {OrderId}", _emailQueueName, email, order.OrderNumber);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to publish payment confirmation message to {Queue} for {Email}, OrderId: {OrderId}", _emailQueueName, email, order.OrderNumber);
                }
            }

            return response;
        });
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
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