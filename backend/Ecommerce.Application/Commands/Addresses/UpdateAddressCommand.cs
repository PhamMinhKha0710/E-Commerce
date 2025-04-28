using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Commands;
public class UpdateAddressCommand : IRequest<AddressDto>
{
    public int AddressId { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}