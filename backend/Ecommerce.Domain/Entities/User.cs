namespace Ecommerce.Domain.Entities;
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; } = string.Empty;
    public bool IsVerified { get; set; }

    // Navigation property
    public List <UserAddress> UserAddresses { get; set; } = new List<UserAddress>();
    public List<UserPaymentMethod> PaymentMethods { get; set; } = new List<UserPaymentMethod>();
    public List<UserReview> Reviews { get; set; } = new List<UserReview>();
    public List<ShoppingCart> ShoppingCarts { get; set; } = new List<ShoppingCart>();
    public List<ShopOrder> ShopOrders { get; set; } = new List<ShopOrder>();
    public List<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}