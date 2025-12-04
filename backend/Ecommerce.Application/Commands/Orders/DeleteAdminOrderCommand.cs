using MediatR;

namespace Ecommerce.Application.Commands.Orders;

public class DeleteAdminOrderCommand : IRequest<bool>
{
    public int OrderId { get; set; }
}



















