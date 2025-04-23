namespace Ecommerce.Domain.Entities;
public class ShopOrder
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal OrderTotal { get; set; }
    public decimal ShippingAmount { get; set; } = 0;
    public decimal DiscountAmount { get; set; } = 0;
    public string Note { get; set; } = string.Empty;

    // Khóa ngoại
    public int PaymentMethodId { get; set; }
    public int ShippingAddressId { get; set; }
    public int ShippingMethodId { get; set; }
    public int UserId { get; set; }

    // Navigation property
    public UserPaymentMethod PaymentMethod { get; set; }
    public Address ShippingAddress { get; set; }
    public ShippingMethod ShippingMethod { get; set; }
    public User User { get; set; }

    public List<OrderStatusHistory> OrderStatusHistories { get; set; } = new List<OrderStatusHistory>();
    public List<OrderLine> OrderLines { get; set; } = new List<OrderLine>();
}