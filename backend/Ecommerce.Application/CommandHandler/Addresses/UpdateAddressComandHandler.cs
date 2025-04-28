using MediatR;
using Ecommerce.Application.Commands;
using Ecommerce.Application.Interfaces.Repositories;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Common.DTOs;


namespace Ecommerce.Application.Handlers;
public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand, AddressDto>
{
    private readonly IAddressRepository _addressRepository;
    private readonly ILogger<UpdateAddressCommandHandler> _logger;

    public UpdateAddressCommandHandler(IAddressRepository addressRepository, ILogger<UpdateAddressCommandHandler> logger)
    {
        _addressRepository = addressRepository;
        _logger = logger;
    }

    public async Task<AddressDto> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation($"Updating address ID: {request.AddressId} for UserId: {request.UserId}");
        
        var address = await _addressRepository.GetAddressByIdAsync(request.AddressId);
        if (address == null)
        {
            _logger.LogWarning($"Address with ID {request.AddressId} not found");
            throw new KeyNotFoundException($"Address with ID {request.AddressId} not found");
        }

        var userAddress = await _addressRepository.GetUserAddressAsync(request.UserId, request.AddressId);
        if (userAddress == null)
        {
            _logger.LogWarning($"Address with ID {request.AddressId} not associated with user {request.UserId}");
            throw new KeyNotFoundException($"Address with ID {request.AddressId} not associated with user {request.UserId}");
        }

        // Update address details
        address.Name = request.Name;
        address.AddressLine = request.Address;
        address.Phone = request.Phone;
        await _addressRepository.UpdateAddressAsync(address);

        // Handle isDefault
        if (request.IsDefault)
        {
            // Set all other addresses for this user to isDefault: false
            var existingUserAddresses = await _addressRepository.GetUserAddressesByUserIdAsync(request.UserId);
            foreach (var ua in existingUserAddresses.Where(ua => ua.AddressId != request.AddressId && ua.IsDefault))
            {
                ua.IsDefault = false;
                await _addressRepository.UpdateUserAddressAsync(ua);
                _logger.LogInformation($"Set isDefault to false for address ID: {ua.AddressId}");
            }
        }
        userAddress.IsDefault = request.IsDefault;
        await _addressRepository.UpdateUserAddressAsync(userAddress);
        _logger.LogInformation($"Set isDefault to {request.IsDefault} for address ID: {request.AddressId}");

        return new AddressDto
        {
            Id = address.Id.ToString(),
            Name = address.Name,
            Address = address.AddressLine,
            Phone = address.Phone,
            IsDefault = userAddress.IsDefault
        };
    }
}