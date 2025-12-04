namespace Ecommerce.Application.Common.DTOs.Order.Admin;

public class AdminOrderDetailDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal Subtotal { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "pending";
    public string PaymentStatus { get; set; } = "unpaid";
    public string PaymentMethod { get; set; } = string.Empty;
    public string? AdminNote { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string ShippingContactName { get; set; } = string.Empty;
    public string? ShippingContactPhone { get; set; }
    public string? ShippingAddress { get; set; }
    public string ShippingMethod { get; set; } = string.Empty;
    public IReadOnlyList<AdminOrderItemDto> Items { get; set; } = Array.Empty<AdminOrderItemDto>();
    public IReadOnlyList<AdminOrderStatusHistoryDto> StatusHistory { get; set; } = Array.Empty<AdminOrderStatusHistoryDto>();
    public IReadOnlyList<AdminOrderPaymentDto> Payments { get; set; } = Array.Empty<AdminOrderPaymentDto>();
}

