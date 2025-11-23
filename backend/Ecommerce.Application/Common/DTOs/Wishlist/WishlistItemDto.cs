namespace Ecommerce.Application.Common.DTOs.Wishlist;

public class WishlistItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal OldPrice { get; set; }
    public string Currency { get; set; } = "VND";
    public bool HasVariation { get; set; }
    public int QtyInStock { get; set; }
    public int? ProductItemId { get; set; }
    public int? CategoryId { get; set; }
    public DateTime AddedAt { get; set; }
}












