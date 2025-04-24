namespace Ecommerce.Domain.Entities;
public class OrderStatusHistory
{
    public int Id { get; set; }

    // Khóa ngoại
    public int OrderStatusId { get; set; }
    public int ShopOrderId { get; set; }

    // Navigation property
    public OrderStatus OrderStatus { get; set; } = new OrderStatus();
    public ShopOrder ShopOrder { get; set; } = new ShopOrder();
}