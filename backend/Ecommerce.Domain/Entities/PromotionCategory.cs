namespace Ecommerce.Domain.Entities;
public class PromotionCategory
{
    public int PromotionId { get; set; }
    public Promotion Promotion { get; set; } = new Promotion();
    public int ProductCategoryId { get; set; }
    public ProductCategory ProductCategory { get; set; } = new ProductCategory();
}