namespace Ecommerce.Application.Common.DTOs;

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

public class UserListDto
{
    public List<UserDto> Users { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class UpdateUserDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Role { get; set; }
    public bool? IsVerified { get; set; }
}

public class UserStatusDto
{
    public bool IsLocked { get; set; }
}

