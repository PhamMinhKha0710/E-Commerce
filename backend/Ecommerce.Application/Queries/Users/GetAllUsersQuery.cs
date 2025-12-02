using Ecommerce.Application.Common.DTOs.User;
using MediatR;

namespace Ecommerce.Application.Queries.Users;

public class GetAllUsersQuery : IRequest<AdminUserListResponseDto>
{
    public string? Keyword { get; set; }
    public string? Role { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}








