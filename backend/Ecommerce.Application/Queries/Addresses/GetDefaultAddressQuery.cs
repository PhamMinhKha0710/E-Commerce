using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries;

public class GetDefaultAddressQuery : IRequest<AddressDto>
{
    public int UserId {get; set;}
}