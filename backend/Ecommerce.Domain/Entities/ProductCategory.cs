namespace Ecommerce.Domain.Entities;
public class ProductCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public ProductCategory Parent { get; set; }
    public List<Product> Products { get; set; } = new List<Product>();
    public List<ProductCategory> Children { get; set; } = new List<ProductCategory>();
    public List<PromotionCategory> PromotionCategories { get; set; } = new List<PromotionCategory>();
}