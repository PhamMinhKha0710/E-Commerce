using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Commands.Users;

public record UpdateUserCommand(int UserId, UpdateUserDto UpdateDto) : IRequest<UserDto>;

