namespace Ecommerce.Domain.Entities;
public class ProductImage
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }

    // Khóa ngoại
    public int ProductId { get; set; }

    // Navigation property
    public Product Product { get; set; }
}