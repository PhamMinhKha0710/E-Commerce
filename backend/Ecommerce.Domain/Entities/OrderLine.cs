namespace Ecommerce.Domain.Entities;
public class OrderLine
{
    public int Id { get; set; }
    public int Qty { get; set; }
    public decimal Price { get; set; }

    // Khóa ngoại
    public int ShopOrderId { get; set; }
    public int ProductItemId { get; set; }

    // Navigation property
    public ProductItem ProductItem { get; set; }
    public ShopOrder ShopOrder { get; set; }
    public List<UserReview> UserReviews { get; set; } = new List<UserReview>();
}