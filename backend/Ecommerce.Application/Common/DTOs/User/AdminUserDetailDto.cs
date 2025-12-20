namespace Ecommerce.Application.Common.DTOs.User;

public class AdminUserDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? LastActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? AvatarUrl { get; set; }
    public string Initials { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Bio { get; set; }
    public int OrdersCount { get; set; }
    public decimal TotalSpent { get; set; }
    public int WishlistCount { get; set; }
}
























































