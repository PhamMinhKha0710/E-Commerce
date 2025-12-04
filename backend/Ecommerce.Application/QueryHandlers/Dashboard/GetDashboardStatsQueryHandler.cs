using Ecommerce.Application.Common.DTOs.Dashboard;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Dashboard;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.QueryHandlers.Dashboard;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardDataDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;

    public GetDashboardStatsQueryHandler(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IUserRepository userRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
    }

    public async Task<DashboardDataDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var startDate = request.StartDate ?? new DateTime(now.Year, now.Month, 1);
        var endDate = request.EndDate ?? now;
        
        var previousMonthStart = startDate.AddMonths(-1);
        var previousMonthEnd = startDate.AddDays(-1);

        var ordersQuery = _orderRepository.GetOrdersQueryable()
            .Include(o => o.User)
            .Include(o => o.Payments)
            .Include(o => o.OrderStatusHistories)
                .ThenInclude(h => h.OrderStatus)
            .Include(o => o.OrderLines)
                .ThenInclude(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product);

        // Current period stats
        var currentOrders = await ordersQuery
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
            .ToListAsync(cancellationToken);

        // Tính doanh thu từ các đơn hàng đã thanh toán thành công
        // Bao gồm: Completed (thanh toán online thành công), COD (thanh toán tiền mặt)
        var currentPaidOrders = currentOrders
            .Where(o => o.Payments.Any(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "COD"))
            .ToList();

        var currentRevenue = currentPaidOrders.Sum(o => o.OrderTotal);
        var currentOrdersCount = currentOrders.Count;
        var currentProductsCount = await _productRepository.Query().CountAsync(cancellationToken);
        // Note: Product entity doesn't have CreatedAt property, so we can't calculate previous period products
        // Setting to current count so percentage change will be 0
        var previousProductsCount = currentProductsCount;
        
        var currentNewUsers = await _userRepository.GetAllQueryable()
            .Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate)
            .CountAsync(cancellationToken);

        // Previous period stats for comparison
        var previousOrders = await ordersQuery
            .Where(o => o.OrderDate >= previousMonthStart && o.OrderDate <= previousMonthEnd)
            .ToListAsync(cancellationToken);

        var previousPaidOrders = previousOrders
            .Where(o => o.Payments.Any(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "COD"))
            .ToList();

        var previousRevenue = previousPaidOrders.Sum(o => o.OrderTotal);
        var previousOrdersCount = previousOrders.Count;
        var previousNewUsers = await _userRepository.GetAllQueryable()
            .Where(u => u.CreatedAt >= previousMonthStart && u.CreatedAt <= previousMonthEnd)
            .CountAsync(cancellationToken);

        // Calculate percentage changes
        var revenueChangePercent = previousRevenue > 0 
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
            : 0;
        
        var ordersChangePercent = previousOrdersCount > 0 
            ? ((currentOrdersCount - previousOrdersCount) / (double)previousOrdersCount) * 100 
            : 0;
        
        var productsChangePercent = previousProductsCount > 0 
            ? ((currentProductsCount - previousProductsCount) / (double)previousProductsCount) * 100 
            : 0;
        
        var newUsersChangePercent = previousNewUsers > 0 
            ? ((currentNewUsers - previousNewUsers) / (double)previousNewUsers) * 100 
            : 0;

        // Get recent orders (last 5)
        var recentOrders = await ordersQuery
            .OrderByDescending(o => o.OrderDate)
            .Take(5)
            .Select(o => new RecentOrderDto
            {
                OrderId = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}".Trim() : "Khách hàng",
                Status = o.OrderStatusHistories != null && o.OrderStatusHistories.Any()
                    ? o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).First().OrderStatus.Status
                    : "Pending",
                OrderDate = o.OrderDate,
                OrderTotal = o.OrderTotal
            })
            .ToListAsync(cancellationToken);

        // Get top selling products
        var topProducts = await ordersQuery
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
            .SelectMany(o => o.OrderLines)
            .GroupBy(ol => new { ol.ProductItem.ProductId, ol.ProductItem.Product.Name, ol.ProductItem.ImageUrl })
            .Select(g => new
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.Name,
                ImageUrl = g.Key.ImageUrl,
                SalesCount = g.Sum(ol => ol.Qty),
                Revenue = g.Sum(ol => ol.Price * ol.Qty)
            })
            .OrderByDescending(p => p.SalesCount)
            .Take(5)
            .ToListAsync(cancellationToken);

        var maxSales = topProducts.Any() ? topProducts.Max(p => p.SalesCount) : 1;
        var topSellingProducts = topProducts.Select(p => new TopSellingProductDto
        {
            ProductId = p.ProductId,
            ProductName = p.ProductName,
            ImageUrl = p.ImageUrl,
            SalesCount = p.SalesCount,
            Revenue = p.Revenue,
            ProgressPercent = (int)((p.SalesCount / (double)maxSales) * 100)
        }).ToList();

        // Get revenue chart data (last 12 months)
        var chartData = new List<RevenueChartDataDto>();
        for (int i = 11; i >= 0; i--)
        {
            var monthStart = new DateTime(now.Year, now.Month, 1).AddMonths(-i);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);
            
            var monthOrders = await ordersQuery
                .Where(o => o.OrderDate >= monthStart && o.OrderDate <= monthEnd)
                .ToListAsync(cancellationToken);
            
            var monthRevenue = monthOrders
                .Where(o => o.Payments.Any(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "COD"))
                .Sum(o => o.OrderTotal);

            chartData.Add(new RevenueChartDataDto
            {
                Period = $"T{monthStart.Month}",
                Revenue = monthRevenue
            });
        }

        // Get new users (last 5)
        var newUsers = await _userRepository.GetAllQueryable()
            .OrderByDescending(u => u.CreatedAt)
            .Take(5)
            .Select(u => new NewUserDto
            {
                Id = u.Id,
                Name = $"{u.FirstName} {u.LastName}".Trim(),
                Email = u.Email,
                CreatedAt = u.CreatedAt,
                AvatarUrl = u.AvatarUrl,
                Initials = GetInitials(u.FirstName, u.LastName)
            })
            .ToListAsync(cancellationToken);

        return new DashboardDataDto
        {
            Stats = new DashboardStatsDto
            {
                TotalRevenue = currentRevenue,
                RevenueChangePercent = revenueChangePercent,
                TotalOrders = currentOrdersCount,
                OrdersChangePercent = (decimal)ordersChangePercent,
                TotalProducts = currentProductsCount,
                ProductsChangePercent = (decimal)productsChangePercent,
                NewUsers = currentNewUsers,
                NewUsersChangePercent = (decimal)newUsersChangePercent
            },
            RecentOrders = recentOrders,
            TopSellingProducts = topSellingProducts,
            RevenueChartData = chartData,
            NewUsers = newUsers
        };
    }

    private static string GetInitials(string? firstName, string? lastName)
    {
        var first = string.IsNullOrWhiteSpace(firstName) ? "" : firstName.Trim().Substring(0, 1).ToUpper();
        var last = string.IsNullOrWhiteSpace(lastName) ? "" : lastName.Trim().Substring(0, 1).ToUpper();
        return first + last;
    }
}

