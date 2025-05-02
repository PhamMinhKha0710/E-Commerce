using System.Text.Json;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler;
public class RetryPaymentCommandHandler : IRequestHandler<RetryPaymentCommand, CreateOrderResponseDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IPaymentService _paymentService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<RetryPaymentCommandHandler> _logger;

    public RetryPaymentCommandHandler(
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository,
        IPaymentService paymentService,
        IHttpContextAccessor httpContextAccessor,
        ILogger<RetryPaymentCommandHandler> logger)
    {
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _paymentService = paymentService;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<CreateOrderResponseDto> Handle(RetryPaymentCommand request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null)
        {
            _logger.LogWarning($"Order not found: {request.OrderId}");
            throw new InvalidOperationException("Order not found.");
        }

        var currentStatus = order.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()?.OrderStatus.Status;
        if (currentStatus != "Pending")
        {
            _logger.LogWarning($"Order {order.OrderNumber} is not in Pending state: {currentStatus}");
            throw new InvalidOperationException("Order is not in a state that allows retrying payment.");
        }

        var hasCompletedPayment = order.Payments.Any(p => p.PaymentStatus == "Completed");
        if (hasCompletedPayment)
        {
            _logger.LogWarning($"Order {order.OrderNumber} already has a completed payment.");
            throw new InvalidOperationException("Order already has a completed payment.");
        }

        foreach (var line in order.OrderLines)
        {
            var productItem = await _orderRepository.GetProductItemByIdAsync(line.ProductItemId);
            if (productItem == null || productItem.QtyInStock < line.Qty)
            {
                _logger.LogWarning($"Insufficient stock for product item {line.ProductItemId} in order {order.OrderNumber}.");
                throw new InvalidOperationException($"Insufficient stock for product item {line.ProductItemId}.");
            }
        }

        var paymentMethod = await _orderRepository.GetPaymentMethodByNameAsync("VnPay");
        if (paymentMethod == null)
        {
            _logger.LogWarning("Payment method VnPay not found.");
            throw new InvalidOperationException("Payment method not found.");
        }

        var newPayment = new Payment
        {
            ShopOrderId = order.Id,
            PaymentMethodId = paymentMethod.Id,
            Amount = order.OrderTotal,
            PaymentStatus = "Pending",
            TransactionId = $"{order.Id}-{DateTime.Now.Ticks}",
            CreatedAt = DateTime.UtcNow
        };
        await _paymentRepository.CreatePaymentAsync(newPayment);

        var vnpayRequest = new VnPaymentRequestDto
        {
            OrderId = order.Id,
            FullName = "Customer",
            Description = $"Thanh toán lại cho đơn hàng {order.OrderNumber}",
            Amount = (double)order.OrderTotal,
            CreatedDate = DateTime.UtcNow
        };
        var paymentUrl = await _paymentService.CreatePaymentUrl(_httpContextAccessor.HttpContext, vnpayRequest);

        await _paymentRepository.CreatePaymentLogAsync(new PaymentLog
        {
            PaymentId = newPayment.Id,
            EventType = "RetryPaymentRequested",
            Message = $"Retry payment requested for order {order.OrderNumber}",
            Data = JsonSerializer.Serialize(vnpayRequest),
            CreatedAt = DateTime.UtcNow
        });

        return new CreateOrderResponseDto
        {
            OrderId = order.Id,
            OrderNumber = order.OrderNumber,
            PaymentUrl = paymentUrl
        };
    }
}