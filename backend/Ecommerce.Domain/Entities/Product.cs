namespace Ecommerce.Domain.Entities;
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int QtyInStock { get; set; }
    public string Currency { get; set; } = "VND";
    public int Rating { get; set; } = 0;
    public int TotalRatingCount { get; set; } = 0;
    public bool HasVariation { get; set; } = false;
    public string Suggestion { get; set; } = string.Empty;

    // Khóa ngoại
    public int ProductCategoryId { get; set; }
    public int BrandId { get; set; }

    // Navigation property
    public ProductCategory ProductCategory { get; set; }
    public Brand Brand { get; set; }
    public List<ProductItem> ProductItems { get; set; } = new List<ProductItem>();
    public List<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
}