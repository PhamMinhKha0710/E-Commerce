using MediatR;
using Ecommerce.Application.Commands;
using Ecommerce.Application.Interfaces.Repositories;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.Handlers;
public class DeleteAddressCommandHandler : IRequestHandler<DeleteAddressCommand>
{
    private readonly IAddressRepository _addressRepository;
    private readonly ILogger<DeleteAddressCommandHandler> _logger;

    public DeleteAddressCommandHandler(IAddressRepository addressRepository, ILogger<DeleteAddressCommandHandler> logger)
    {
        _addressRepository = addressRepository;
        _logger = logger;
    }

    public async Task Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Deleting address ID: {request.AddressId} for UserId: {request.UserId}");

        // Check if the user-address association exists
        var userAddress = await _addressRepository.GetUserAddressAsync(request.UserId, request.AddressId);
        if (userAddress == null)
        {
            _logger.LogWarning($"User address not found for AddressId: {request.AddressId}, UserId: {request.UserId}");
            throw new KeyNotFoundException($"User address not found");
        }

        // Delete all UserAddress records associated with this AddressId
        var userAddresses = await _addressRepository.GetUserAddressesByAddressIdAsync(request.AddressId);
        foreach (var ua in userAddresses)
        {
            await _addressRepository.DeleteUserAddressAsync(ua.UserId, ua.AddressId);
            _logger.LogInformation($"Deleted UserAddress for UserId: {ua.UserId}, AddressId: {ua.AddressId}");
        }

        // Delete the Address
        var address = await _addressRepository.GetAddressByIdAsync(request.AddressId);
        if (address == null)
        {
            _logger.LogWarning($"Address with ID {request.AddressId} not found");
            throw new KeyNotFoundException($"Address with ID {request.AddressId} not found");
        }

        await _addressRepository.DeleteAddressAsync(request.AddressId);
        _logger.LogInformation($"Deleted Address ID: {request.AddressId}");
    }
}