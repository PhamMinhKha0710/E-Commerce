using MediatR;

namespace Ecommerce.Application.Commands.Users;

public record DeleteUserCommand(int UserId) : IRequest<bool>;

