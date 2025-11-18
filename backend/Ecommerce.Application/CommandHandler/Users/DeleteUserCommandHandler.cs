using Ecommerce.Application.Commands.Users;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandlers.Users;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IUserRepository _userRepository;

    public DeleteUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(DeleteUserCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(command.UserId);
        
        if (user == null)
            return false;

        await _userRepository.DeleteAsync(command.UserId);

        return true;
    }
}

