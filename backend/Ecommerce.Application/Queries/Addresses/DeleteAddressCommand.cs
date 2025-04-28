using MediatR;

namespace Ecommerce.Application.Commands;
public class DeleteAddressCommand : IRequest
{
    public int AddressId { get; set; }
    public int UserId { get; set; }
}