using Ecommerce.Application.Commands.Orders;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler.Orders;

public class DeleteAdminOrderCommandHandler : IRequestHandler<DeleteAdminOrderCommand, bool>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<DeleteAdminOrderCommandHandler> _logger;

    public DeleteAdminOrderCommandHandler(IOrderRepository orderRepository, ILogger<DeleteAdminOrderCommandHandler> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteAdminOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null)
        {
            throw new KeyNotFoundException($"Order {request.OrderId} not found");
        }

        await _orderRepository.DeleteOrderAsync(order);
        _logger.LogInformation("Admin deleted order {OrderId}", request.OrderId);
        return true;
    }
}






















































