namespace Ecommerce.Application.Common.DTOs.User;

public class AdminUserListResponseDto
{
    public IReadOnlyList<AdminUserListItemDto> Users { get; set; } = Array.Empty<AdminUserListItemDto>();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
