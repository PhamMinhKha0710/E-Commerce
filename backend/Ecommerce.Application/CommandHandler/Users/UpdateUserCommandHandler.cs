using Ecommerce.Application.Commands.Users;
using Ecommerce.Application.Common.DTOs.User;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandlers.Users;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;

    public UpdateUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(command.UserId);
        
        if (user == null)
            throw new Exception("User not found");

        // Update fields if provided
        if (!string.IsNullOrWhiteSpace(command.UpdateDto.FirstName))
            user.FirstName = command.UpdateDto.FirstName;

        if (!string.IsNullOrWhiteSpace(command.UpdateDto.LastName))
            user.LastName = command.UpdateDto.LastName;

        if (!string.IsNullOrWhiteSpace(command.UpdateDto.PhoneNumber))
            user.PhoneNumber = command.UpdateDto.PhoneNumber;

        if (!string.IsNullOrWhiteSpace(command.UpdateDto.Role))
            user.Role = command.UpdateDto.Role;

        if (command.UpdateDto.IsVerified.HasValue)
            user.IsVerified = command.UpdateDto.IsVerified.Value;

        await _userRepository.UpdateAsync(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role,
            IsVerified = user.IsVerified,
            LastActive = user.LastActive,
            IsLocked = user.IsLocked,
            CreatedAt = user.CreatedAt
        };

        return userDto;
    }
}

