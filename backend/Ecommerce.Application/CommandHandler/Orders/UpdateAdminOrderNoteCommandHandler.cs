using Ecommerce.Application.Commands.Orders;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Orders;

public class UpdateAdminOrderNoteCommandHandler : IRequestHandler<UpdateAdminOrderNoteCommand, bool>
{
    private readonly IOrderRepository _orderRepository;

    public UpdateAdminOrderNoteCommandHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<bool> Handle(UpdateAdminOrderNoteCommand request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null)
        {
            throw new KeyNotFoundException($"Order {request.OrderId} not found");
        }

        order.Note = request.Note;
        await _orderRepository.UpdateOrderAsync(order);
        return true;
    }
}

































