namespace Ecommerce.Domain.Entities;
public class ProductCategory
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int? ParentId { get; set; }
    public int? DisplayOrder { get; set; } 
    public ProductCategory? Parent { get; set; }
    public List<Product> Products { get; set; }
    public List<ProductCategory> Children { get; set; }
    public List<PromotionCategory> PromotionCategories { get; set; }
}