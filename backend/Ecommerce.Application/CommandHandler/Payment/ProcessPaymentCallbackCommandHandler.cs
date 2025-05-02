using System.Text.Json;
using Ecommerce.Application.Command;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler;

public class ProcessPaymentCallbackCommandHandler : IRequestHandler<ProcessPaymentCallbackCommand, VnPaymentResponseDto>
{
    private readonly IPaymentService _paymentService;
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly ILogger<ProcessPaymentCallbackCommandHandler> _logger;

    public ProcessPaymentCallbackCommandHandler(
        IPaymentService paymentService,
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository,
        ILogger<ProcessPaymentCallbackCommandHandler> logger)
    {
        _paymentService = paymentService;
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _logger = logger;
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
                    order.OrderStatusHistories.Add(new OrderStatusHistory { OrderStatusId = confirmedStatus.Id });
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

            return response;
        });
    }
}