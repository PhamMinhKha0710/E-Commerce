namespace Ecommerce.Application.Common.DTOs.Profile;

public class ProfileStatsDto
{
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
    public int PendingOrders { get; set; }
    public int ShippingOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int CancelledOrders { get; set; }
}

