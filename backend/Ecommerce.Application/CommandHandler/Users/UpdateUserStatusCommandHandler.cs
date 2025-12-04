using Ecommerce.Application.Commands.Users;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandlers.Users;

public class UpdateUserStatusCommandHandler : IRequestHandler<UpdateUserStatusCommand, bool>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserStatusCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<bool> Handle(UpdateUserStatusCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(command.UserId);
        
        if (user == null)
            return false;

        user.IsLocked = command.IsLocked;
        await _userRepository.UpdateAsync(user);

        return true;
    }
}

