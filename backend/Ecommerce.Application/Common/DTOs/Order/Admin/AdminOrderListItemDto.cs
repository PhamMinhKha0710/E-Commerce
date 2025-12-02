namespace Ecommerce.Application.Common.DTOs.Order.Admin;

public class AdminOrderListItemDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal OrderTotal { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public string Status { get; set; } = "pending";
    public string PaymentStatus { get; set; } = "unpaid";
    public string PaymentMethod { get; set; } = string.Empty;
    public string? AdminNote { get; set; }
}













