using MediatR;
using Ecommerce.Application.Commands;
using Ecommerce.Domain.Entities;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Common.DTOs;

namespace Ecommerce.Application.Handlers;
public class CreateAddressCommandHandler : IRequestHandler<CreateAddressCommand, AddressDto>
{
    private readonly IAddressRepository _addressRepository;

    public CreateAddressCommandHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<AddressDto> Handle(CreateAddressCommand request, CancellationToken cancellationToken)
    {
        var address = new Address
        {
            Name = request.Name,
            AddressLine = request.Address,
            Phone = request.Phone
        };

        await _addressRepository.AddAddressAsync(address);

        var userAddress = new UserAddress
        {
            UserId = request.UserId,
            AddressId = address.Id,
            IsDefault = request.IsDefault
        };

        await _addressRepository.AddUserAddressAsync(userAddress);

        if (request.IsDefault)
        {
            var existingUserAddresses = await _addressRepository.GetUserAddressesByUserIdAsync(request.UserId);
            foreach (var ua in existingUserAddresses.Where(ua => ua.AddressId != address.Id && ua.IsDefault))
            {
                ua.IsDefault = false;
                await _addressRepository.UpdateUserAddressAsync(ua);
            }
        }

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