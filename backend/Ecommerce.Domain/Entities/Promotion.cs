namespace Ecommerce.Domain.Entities;
public class Promotion
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal DiscountRate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<PromotionCategory> PromotionCategories { get; set; } = new List<PromotionCategory>();
}