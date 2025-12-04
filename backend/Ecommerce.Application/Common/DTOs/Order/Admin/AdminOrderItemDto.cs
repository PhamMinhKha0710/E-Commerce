namespace Ecommerce.Application.Common.DTOs.Order.Admin;

public class AdminOrderItemDto
{
    public int OrderLineId { get; set; }
    public int ProductItemId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal => Price * Quantity;
}


















