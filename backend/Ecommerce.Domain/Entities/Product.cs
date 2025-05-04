namespace Ecommerce.Domain.Entities;
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public string Slug { get; set; } 
    public string Description { get; set; } 
    public int QtyInStock { get; set; }
    public string Currency { get; set; } = "VND";
    public int Rating { get; set; } = 0;
    public int TotalRatingCount { get; set; } = 0;
    public bool HasVariation { get; set; } = false;
    public string Suggestion { get; set; } 
    public string ElasticsearchId { get; set; }

    // Khóa ngoại
    public int ProductCategoryId { get; set; }
    public int BrandId { get; set; }

    // Navigation property
    public ProductCategory ProductCategory { get; set; } 
    public Brand Brand { get; set; } 
    public List<ProductItem> ProductItems { get; set; } 
    public List<ProductImage> ProductImages { get; set; } 
}