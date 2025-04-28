using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using MediatR;

namespace Ecommerce.Application.CommandHandlers;

public class GetAddressesQueryHandler : IRequestHandler<GetAddressesQuery, List<AddressDto>>
{
    private readonly IAddressRepository _addressRepository;

    public GetAddressesQueryHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<List<AddressDto>> Handle(GetAddressesQuery request, CancellationToken cancellationToken)
    {
        var addresses = await _addressRepository.GetAddressesByUserIdAsync(request.UserId);
        var userAddresses = await _addressRepository.GetUserAddressesByUserIdAsync(request.UserId);

        return addresses.Select(address =>
        {
            var userAddress = userAddresses.FirstOrDefault(ua => ua.AddressId == address.Id);
            return new AddressDto
            {
                Id = address.Id.ToString(),
                Name = address.Name,
                Address = address.AddressLine,
                Phone = address.Phone,
                IsDefault = userAddress?.IsDefault ?? false
            };
        }).ToList();
    }
}