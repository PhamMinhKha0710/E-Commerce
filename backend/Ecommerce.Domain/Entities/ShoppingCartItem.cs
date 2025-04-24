namespace Ecommerce.Domain.Entities;
public class ShoppingCartItem
{
    public int Id { get; set; }
    public int Qty { get; set; }

    // Khóa ngoại
    public int ShoppingCartId { get; set; }
    public int ProductItemId { get; set; }

    // Navigation property
    public ShoppingCart ShoppingCart { get; set; } = new ShoppingCart();
    public ProductItem ProductItem { get; set; } = new ProductItem();
}