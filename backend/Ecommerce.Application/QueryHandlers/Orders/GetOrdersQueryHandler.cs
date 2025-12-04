using Ecommerce.Application.Common.DTOs.Order;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Orders;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.QueryHandlers.Orders;

public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, OrdersListDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<GetOrdersQueryHandler> _logger;

    public GetOrdersQueryHandler(
        IOrderRepository orderRepository,
        ILogger<GetOrdersQueryHandler> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task<OrdersListDto> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Domain.Entities.ShopOrder> query = _orderRepository
            .GetOrdersQueryable()
            .Where(o => o.UserId == request.UserId)
            .Include(o => o.OrderLines)
                .ThenInclude(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product)
            .Include(o => o.OrderStatusHistories)
                .ThenInclude(h => h.OrderStatus)
            .Include(o => o.Payments);

        // Filter theo status
        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status.ToLower() != "all")
        {
            var statusLower = request.Status.ToLower();
            query = statusLower switch
            {
                "waiting_for_payment" or "unpaid" => query.Where(o => 
                    // Kiểm tra OrderStatus có phải là pending/unpaid/waiting
                    o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault() != null &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus != null &&
                    (o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("pending") ||
                     o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("unpaid") ||
                     o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("waiting")) &&
                    // QUAN TRỌNG: Loại trừ các đơn hàng đã thanh toán thành công
                    (o.Payments == null || !o.Payments.Any() || !o.Payments.Any(p => p.PaymentStatus == "Completed"))),
                "processing" or "confirmed" => query.Where(o => 
                    o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault() != null &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus != null &&
                    (o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("processing") ||
                     o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("confirmed"))),
                "shipping" => query.Where(o => 
                    o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault() != null &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus != null &&
                    (o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("shipping") ||
                     o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("transport"))),
                "completed" or "success" => query.Where(o => 
                    o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault() != null &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus != null &&
                    (o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("completed") ||
                     o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("success") ||
                     o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("delivered"))),
                "cancelled" or "returned" => query.Where(o => 
                    o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault() != null &&
                    o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus != null &&
                    (o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("cancel") ||
                     o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).FirstOrDefault()!.OrderStatus.Status.ToLower().Contains("return"))),
                _ => query
            };
        }

        // Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchTerm = request.Search.ToLower();
            query = query.Where(o => 
                o.OrderNumber.ToLower().Contains(searchTerm) ||
                o.OrderLines.Any(ol => ol.ProductItem.Product.Name.ToLower().Contains(searchTerm)));
        }

        // Sắp xếp theo ngày đặt hàng (mới nhất trước)
        query = query.OrderByDescending(o => o.OrderDate);

        var totalCount = await query.CountAsync(cancellationToken);

        // Pagination
        var orders = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var orderDtos = orders.Select(o => new OrderListItemDto
        {
            OrderId = o.Id,
            OrderNumber = o.OrderNumber,
            OrderDate = o.OrderDate,
            OrderTotal = o.OrderTotal,
            Status = ResolveStatus(o),
            StatusDisplay = GetStatusDisplay(ResolveStatus(o)),
            Items = o.OrderLines.Select(line => new OrderItemDto
            {
                ProductItemId = line.ProductItemId,
                ProductId = line.ProductItem?.ProductId ?? 0,
                CategoryId = line.ProductItem?.Product?.ProductCategoryId ?? 0,
                ProductName = line.ProductItem?.Product?.Name ?? "Sản phẩm",
                Quantity = line.Qty,
                Price = line.Price,
                LineTotal = line.Price * line.Qty,
                ImageUrl = line.ProductItem?.ImageUrl,
                StoreName = "Cửa hàng", // Có thể lấy từ shop/store nếu có
                IsGift = false, // Có thể kiểm tra từ promotion hoặc product flags
                HasVariations = line.ProductItem?.Product?.HasVariation ?? false
            }).ToList()
        }).ToList();

        _logger.LogInformation("Retrieved {Count} orders for user {UserId} with status {Status}", 
            orderDtos.Count, request.UserId, request.Status);

        return new OrdersListDto
        {
            Orders = orderDtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    private static string ResolveStatus(Domain.Entities.ShopOrder order)
    {
        var latestStatus = order.OrderStatusHistories?
            .OrderByDescending(h => h.CreateAt)
            .FirstOrDefault()?.OrderStatus?.Status;

        return string.IsNullOrWhiteSpace(latestStatus) ? "Pending" : latestStatus;
    }

    private static string GetStatusDisplay(string status)
    {
        var statusLower = status.ToLower();
        return statusLower switch
        {
            var s when s.Contains("pending") || s.Contains("unpaid") || s.Contains("waiting") => "Chờ thanh toán",
            var s when s.Contains("processing") || s.Contains("confirmed") => "Đang xử lý",
            var s when s.Contains("shipping") || s.Contains("transport") => "Đang vận chuyển",
            var s when s.Contains("completed") || s.Contains("success") || s.Contains("delivered") => "Giao hàng thành công",
            var s when s.Contains("cancel") => "Đã hủy",
            var s when s.Contains("return") => "Đã trả hàng",
            _ => status
        };
    }
}

