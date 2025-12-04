namespace Ecommerce.Application.Common.DTOs.Reports;

public class ReportDto
{
    public int ReportId { get; set; }
    public string ReportType { get; set; } = string.Empty;
    public string ReportName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime GeneratedAt { get; set; }
    public string Format { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public byte[]? FileContent { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
}

public class RevenueReportData
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public List<RevenueReportItem> DailyRevenue { get; set; } = new();
    public List<RevenueReportItem> MonthlyRevenue { get; set; } = new();
}

public class RevenueReportItem
{
    public string Period { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

public class OrdersReportData
{
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int PendingOrders { get; set; }
    public int CancelledOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<OrderReportItem> Orders { get; set; } = new();
}

public class OrderReportItem
{
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal OrderTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
}

public class ProductsReportData
{
    public int TotalProducts { get; set; }
    public int LowStockProducts { get; set; }
    public int OutOfStockProducts { get; set; }
    public List<ProductReportItem> TopSellingProducts { get; set; } = new();
    public List<ProductReportItem> LowStockProductsList { get; set; } = new();
}

public class ProductReportItem
{
    public string ProductName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int SalesCount { get; set; }
    public decimal Revenue { get; set; }
    public int StockQuantity { get; set; }
    public decimal Price { get; set; }
}

public class UsersReportData
{
    public int TotalUsers { get; set; }
    public int NewUsers { get; set; }
    public int ActiveUsers { get; set; }
    public List<UserReportItem> Users { get; set; } = new();
}

public class UserReportItem
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
}

public class SalesReportData
{
    public decimal TotalSales { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public List<SalesReportItem> SalesByCategory { get; set; } = new();
    public List<SalesReportItem> SalesByProduct { get; set; } = new();
}

public class SalesReportItem
{
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Revenue { get; set; }
    public decimal Percentage { get; set; }
}


