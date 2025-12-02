namespace Ecommerce.Application.Common.DTOs.Order;

public class OrderItemDto
{
    public int ProductItemId { get; set; }
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal LineTotal { get; set; }
    public string? ImageUrl { get; set; }
    public string? StoreName { get; set; }
    public bool IsGift { get; set; }
    public bool HasVariations { get; set; }
}





