using Ecommerce.Domain.Entitie;

namespace Ecommerce.Domain.Entities;
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } 
    public string PhoneNumber { get; set; } 
    public string Password { get; set; } 
    public string Role { get; set; } = "User";
    public string FirstName { get; set; } 
    public string LastName { get; set; } 
    public string? AvatarUrl { get; set; } = string.Empty;
    public bool IsVerified { get; set; }

    // Navigation property
    public List <UserAddress> UserAddresses { get; set; } 
    public List<UserReview> Reviews { get; set; } 
    public List<ShoppingCart> ShoppingCarts { get; set; } 
    public List<ShopOrder> ShopOrders { get; set; } 
    public List<RefreshToken> RefreshTokens { get; set; } 
    public List<UserSearch> UserSearches { get; set; }
    public List<UserViewHistory> UserViewHistories { get; set; }
}