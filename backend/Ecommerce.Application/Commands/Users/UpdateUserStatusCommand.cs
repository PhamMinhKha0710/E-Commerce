using MediatR;

namespace Ecommerce.Application.Commands.Users;

public record UpdateUserStatusCommand(int UserId, bool IsLocked) : IRequest<bool>;

