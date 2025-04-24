namespace Ecommerce.Domain.Entities;
public class UserPaymentMethod
{
    public int Id { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public bool IsDefault { get; set; }

    // Khóa ngoại
    public int UserId { get; set; }
    public int PaymentTypeId { get; set; }

    // Navigation property
    public User User { get; set; } = new User();
    public PaymentType PaymentType { get; set; } = new PaymentType();
    public List<ShopOrder> ShopOrders { get; set; } = new List<ShopOrder>();
}