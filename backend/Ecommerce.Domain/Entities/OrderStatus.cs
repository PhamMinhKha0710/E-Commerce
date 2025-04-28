namespace Ecommerce.Domain.Entities;
public class OrderStatus
{
    public int Id { get; set; }
    public string Status { get; set; }

    // Navigation property
    public List<OrderStatusHistory> OrderStatusHistories { get; set; } 
}