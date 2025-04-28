namespace Ecommerce.Domain.Entities;
public class ShoppingCart
{
    public int Id { get; set; }

    // Khóa ngoại
    public int UserId { get; set; }

    // Navigation property
    public User User { get; set; }
    public List<ShoppingCartItem> ShoppingCartItems { get; set; } = new List<ShoppingCartItem>();
}