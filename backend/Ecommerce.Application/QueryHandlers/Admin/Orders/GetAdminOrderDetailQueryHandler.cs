using Ecommerce.Application.Common.DTOs.Order.Admin;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.AdminOrders;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Admin.Orders;

public class GetAdminOrderDetailQueryHandler : IRequestHandler<GetAdminOrderDetailQuery, AdminOrderDetailDto?>
{
    private readonly IOrderRepository _orderRepository;

    public GetAdminOrderDetailQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<AdminOrderDetailDto?> Handle(GetAdminOrderDetailQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null)
        {
            return null;
        }

        var latestStatus = order.OrderStatusHistories?
            .OrderByDescending(h => h.CreateAt)
            .FirstOrDefault()?.OrderStatus?.Status ?? "pending";

        var latestPayment = order.Payments?
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefault();

        return new AdminOrderDetailDto
        {
            OrderId = order.Id,
            OrderNumber = order.OrderNumber,
            OrderDate = order.OrderDate,
            Subtotal = order.OrderTotal - order.ShippingAmount + order.DiscountAmount,
            ShippingAmount = order.ShippingAmount,
            DiscountAmount = order.DiscountAmount,
            Total = order.OrderTotal,
            Status = latestStatus,
            PaymentStatus = latestPayment?.PaymentStatus ?? "unpaid",
            PaymentMethod = latestPayment?.PaymentMethod?.Name ?? latestPayment?.PaymentStatus ?? "N/A",
            AdminNote = order.Note,
            CustomerName = $"{order.User?.FirstName} {order.User?.LastName}".Trim(),
            CustomerEmail = order.User?.Email ?? string.Empty,
            CustomerPhone = order.User?.PhoneNumber,
            ShippingContactName = order.ShippingAddress?.Name ?? $"{order.User?.FirstName} {order.User?.LastName}".Trim(),
            ShippingContactPhone = order.ShippingAddress?.Phone ?? order.User?.PhoneNumber,
            ShippingAddress = order.ShippingAddress?.AddressLine,
            ShippingMethod = order.ShippingMethod?.Name ?? "Standard",
            Items = order.OrderLines?.Select(line => new AdminOrderItemDto
            {
                OrderLineId = line.Id,
                ProductItemId = line.ProductItemId,
                ProductId = line.ProductItem?.ProductId ?? 0,
                ProductName = line.ProductItem?.Product?.Name ?? "Sản phẩm",
                Sku = line.ProductItem?.SKU,
                ImageUrl = line.ProductItem?.ImageUrl,
                Price = line.Price,
                Quantity = line.Qty
            }).ToList() ?? new List<AdminOrderItemDto>(),
            StatusHistory = order.OrderStatusHistories?
                .OrderByDescending(h => h.CreateAt)
                .Select(h => new AdminOrderStatusHistoryDto
                {
                    Status = h.OrderStatus?.Status ?? string.Empty,
                    DisplayName = h.OrderStatus?.Status ?? string.Empty,
                    ChangedAt = h.CreateAt
                }).ToList() ?? new List<AdminOrderStatusHistoryDto>(),
            Payments = order.Payments?
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new AdminOrderPaymentDto
                {
                    Method = p.PaymentMethod?.Name ?? "N/A",
                    Status = p.PaymentStatus,
                    Amount = p.Amount,
                    TransactionId = p.TransactionId,
                    CreatedAt = p.CreatedAt
                }).ToList() ?? new List<AdminOrderPaymentDto>()
        };
    }
}

