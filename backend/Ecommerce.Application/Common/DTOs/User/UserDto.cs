namespace Ecommerce.Application.Common.DTOs.User;

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = "User";
    public bool IsVerified { get; set; }
    public DateTime? LastActive { get; set; }
    public bool IsLocked { get; set; }
    public DateTime CreatedAt { get; set; }
}
