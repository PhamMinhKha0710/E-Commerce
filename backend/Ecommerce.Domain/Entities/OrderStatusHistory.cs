namespace Ecommerce.Domain.Entities;
public class OrderStatusHistory
{
    public int Id { get; set; }

    // Khóa ngoại
    public int OrderStatusId { get; set; }
    public int ShopOrderId { get; set; }

    // Navigation property
    public OrderStatus OrderStatus { get; set; } 
    public ShopOrder ShopOrder { get; set; }
}