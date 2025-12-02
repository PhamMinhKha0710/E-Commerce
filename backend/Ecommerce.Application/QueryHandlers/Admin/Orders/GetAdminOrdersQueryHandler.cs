using Ecommerce.Application.Common.DTOs.Order.Admin;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.AdminOrders;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.QueryHandlers.Admin.Orders;

public class GetAdminOrdersQueryHandler : IRequestHandler<GetAdminOrdersQuery, AdminOrderListResponseDto>
{
    private readonly IOrderRepository _orderRepository;

    public GetAdminOrdersQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<AdminOrderListResponseDto> Handle(GetAdminOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _orderRepository.GetOrdersQueryable()
            .Include(o => o.User)
            .Include(o => o.Payments)
                .ThenInclude(p => p.PaymentMethod)
            .Include(o => o.OrderStatusHistories)
                .ThenInclude(h => h.OrderStatus)
            .OrderByDescending(o => o.OrderDate)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.Trim().ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(keyword) ||
                (o.User != null && (
                    o.User.FirstName.ToLower().Contains(keyword) ||
                    o.User.LastName.ToLower().Contains(keyword) ||
                    o.User.Email.ToLower().Contains(keyword)))
            );
        }

        if (request.DateFrom.HasValue)
        {
            query = query.Where(o => o.OrderDate >= request.DateFrom.Value);
        }

        if (request.DateTo.HasValue)
        {
            query = query.Where(o => o.OrderDate <= request.DateTo.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var normalized = request.Status.ToLower();
            query = query.Where(o =>
                o.OrderStatusHistories != null &&
                o.OrderStatusHistories
                    .OrderByDescending(h => h.CreateAt)
                    .Select(h => h.OrderStatus.Status)
                    .Take(1)
                    .Any(status => status != null && status.ToLower().Contains(normalized)));
        }

        if (!string.IsNullOrWhiteSpace(request.PaymentStatus))
        {
            var payment = request.PaymentStatus.ToLower();
            query = query.Where(o =>
                o.Payments != null &&
                o.Payments
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => p.PaymentStatus)
                    .Take(1)
                    .Any(status => status != null && status.ToLower().Contains(payment)));
        }

        var total = await query.CountAsync(cancellationToken);

        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;

        var orders = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = orders.Select(MapToListItem).ToList();

        return new AdminOrderListResponseDto
        {
            Orders = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    private static AdminOrderListItemDto MapToListItem(Domain.Entities.ShopOrder order)
    {
        var latestStatus = order.OrderStatusHistories?
            .OrderByDescending(h => h.CreateAt)
            .FirstOrDefault()?.OrderStatus?.Status ?? "pending";

        var latestPayment = order.Payments?
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefault();

        return new AdminOrderListItemDto
        {
            OrderId = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerName = $"{order.User?.FirstName} {order.User?.LastName}".Trim(),
            CustomerEmail = order.User?.Email ?? string.Empty,
            CustomerPhone = order.User?.PhoneNumber,
            OrderDate = order.OrderDate,
            OrderTotal = order.OrderTotal,
            ShippingAmount = order.ShippingAmount,
            DiscountAmount = order.DiscountAmount,
            Status = latestStatus,
            PaymentStatus = latestPayment?.PaymentStatus ?? "unpaid",
            PaymentMethod = latestPayment?.PaymentMethod?.Name ?? latestPayment?.PaymentStatus ?? "N/A",
            AdminNote = order.Note
        };
    }
}

