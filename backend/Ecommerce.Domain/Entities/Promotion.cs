namespace Ecommerce.Domain.Entities;
public class Promotion
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public bool IsActive { get; set; }
    public string Description { get; set; }
    public decimal DiscountRate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<PromotionCategory> PromotionCategories { get; set; } 
    public List<ShopOrder> ShopOrders {get; set;}
}