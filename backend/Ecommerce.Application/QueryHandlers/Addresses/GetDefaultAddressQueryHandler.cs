using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using MediatR;

namespace Ecommerce.Application.QueryHandlers;

public class GetDefaultAddressQueryHandler : IRequestHandler<GetDefaultAddressQuery, AddressDto> {
    private readonly IAddressRepository _addressRepository;
    public GetDefaultAddressQueryHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<AddressDto?> Handle(GetDefaultAddressQuery request, CancellationToken cancellationToken)
    {
        var addresses = await _addressRepository.GetAddressesByUserIdAsync(request.UserId);
        var userAddresses = await _addressRepository.GetUserAddressesByUserIdAsync(request.UserId);

        var defaultUserAddress = userAddresses.FirstOrDefault(ua => ua.IsDefault);
        if (defaultUserAddress == null)
        {
            return null; 
        }

        var defaultAddress = addresses.FirstOrDefault(a => a.Id == defaultUserAddress.AddressId);
        if (defaultAddress == null)
        {
            return null; 
        }

        return new AddressDto
        {
            Id = defaultAddress.Id.ToString(),
            Name = defaultAddress.Name,
            Address = defaultAddress.AddressLine,
            Phone = defaultAddress.Phone,
            IsDefault = true 
        };
    }
}