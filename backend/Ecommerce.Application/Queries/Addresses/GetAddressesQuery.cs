using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries;
public class GetAddressesQuery : IRequest<List<AddressDto>>
{
    public int UserId { get; set; }
}