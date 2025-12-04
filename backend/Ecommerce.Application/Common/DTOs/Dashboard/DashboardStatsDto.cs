namespace Ecommerce.Application.Common.DTOs.Dashboard;

public class DashboardStatsDto
{
    public decimal TotalRevenue { get; set; }
    public decimal RevenueChangePercent { get; set; }
    public int TotalOrders { get; set; }
    public decimal OrdersChangePercent { get; set; }
    public int TotalProducts { get; set; }
    public decimal ProductsChangePercent { get; set; }
    public int NewUsers { get; set; }
    public decimal NewUsersChangePercent { get; set; }
}

public class RecentOrderDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal OrderTotal { get; set; }
}

public class TopSellingProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int SalesCount { get; set; }
    public decimal Revenue { get; set; }
    public int ProgressPercent { get; set; }
}

public class RevenueChartDataDto
{
    public string Period { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
}

public class DashboardDataDto
{
    public DashboardStatsDto Stats { get; set; } = new();
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
    public List<TopSellingProductDto> TopSellingProducts { get; set; } = new();
    public List<RevenueChartDataDto> RevenueChartData { get; set; } = new();
    public List<NewUserDto> NewUsers { get; set; } = new();
}

public class NewUserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? AvatarUrl { get; set; }
    public string Initials { get; set; } = string.Empty;
}














