using Ecommerce.Application.Common.DTOs.User;
using MediatR;

namespace Ecommerce.Application.Queries.Users;

public class GetUserByIdQuery : IRequest<AdminUserDetailDto>
{
    public int UserId { get; set; }
}






























