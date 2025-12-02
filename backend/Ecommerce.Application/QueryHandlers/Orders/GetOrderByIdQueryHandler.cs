using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Orders;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.QueryHandlers.Orders;

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderResponseDto?>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<GetOrderByIdQueryHandler> _logger;

    public GetOrderByIdQueryHandler(
        IOrderRepository orderRepository,
        ILogger<GetOrderByIdQueryHandler> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task<OrderResponseDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);

        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found", request.OrderId);
            return null;
        }

        // Kiểm tra xem đơn hàng có thuộc về user không
        if (order.UserId != request.UserId)
        {
            _logger.LogWarning("User {UserId} attempted to access order {OrderId} which belongs to another user", 
                request.UserId, request.OrderId);
            return null;
        }

        // Lấy status hiện tại
        var latestStatus = order.OrderStatusHistories?
            .OrderByDescending(h => h.CreateAt)
            .FirstOrDefault()?.OrderStatus?.Status ?? "Pending";

        var orderDto = new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            OrderDate = order.OrderDate,
            OrderTotal = order.OrderTotal,
            ShippingAmount = order.ShippingAmount,
            DiscountAmount = order.DiscountAmount,
            Note = order.Note ?? string.Empty,
            Status = latestStatus,
            PromotionId = order.PromotionId,
            ShippingAddress = order.ShippingAddress != null ? new AddressDto
            {
                Id = order.ShippingAddress.Id.ToString(),
                Name = order.ShippingAddress.Name ?? string.Empty,
                Address = order.ShippingAddress.AddressLine ?? string.Empty,
                Phone = order.ShippingAddress.Phone ?? string.Empty,
                IsDefault = false
            } : new AddressDto(),
            OrderLines = order.OrderLines.Select(line => new OrderLineDto
            {
                Id = line.Id,
                ProductItemId = line.ProductItemId,
                ProductName = line.ProductItem?.Product?.Name ?? "Sản phẩm",
                Quantity = line.Qty,
                Price = line.Price,
                ImageUrl = line.ProductItem?.ImageUrl ?? 
                          line.ProductItem?.Product?.ProductImages?.FirstOrDefault()?.ImageUrl
            }).ToList()
        };

        _logger.LogInformation("Retrieved order {OrderId} for user {UserId}", request.OrderId, request.UserId);

        return orderDto;
    }
}

