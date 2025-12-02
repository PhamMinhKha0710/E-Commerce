using Ecommerce.Application.Commands.Orders;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler.Orders;

public class UpdateAdminOrderStatusCommandHandler : IRequestHandler<UpdateAdminOrderStatusCommand, bool>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<UpdateAdminOrderStatusCommandHandler> _logger;

    private static readonly Dictionary<string, string> StatusMap = new(StringComparer.OrdinalIgnoreCase)
    {
        ["pending"] = "Pending",
        ["waiting_for_payment"] = "Pending",
        ["processing"] = "Processing",
        ["confirmed"] = "Confirmed",
        ["shipping"] = "Shipping",
        ["delivered"] = "Completed",
        ["completed"] = "Completed",
        ["success"] = "Completed",
        ["cancelled"] = "Cancelled",
        ["canceled"] = "Cancelled",
        ["refunded"] = "Refunded",
        ["returned"] = "Returned"
    };

    public UpdateAdminOrderStatusCommandHandler(
        IOrderRepository orderRepository,
        ILogger<UpdateAdminOrderStatusCommandHandler> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task<bool> Handle(UpdateAdminOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null)
        {
            throw new KeyNotFoundException($"Order {request.OrderId} not found");
        }

        if (string.IsNullOrWhiteSpace(request.Status))
        {
            throw new ArgumentException("Status is required", nameof(request.Status));
        }

        var normalizedStatus = NormalizeStatus(request.Status);
        var statusEntity = await _orderRepository.GetOrderStatusByNameAsync(normalizedStatus);
        if (statusEntity == null)
        {
            statusEntity = new OrderStatus { Status = normalizedStatus };
            await _orderRepository.AddOrderStatusAsync(statusEntity);
        }

        order.OrderStatusHistories ??= new List<OrderStatusHistory>();
        order.OrderStatusHistories.Add(new OrderStatusHistory
        {
            OrderStatusId = statusEntity.Id,
            OrderStatus = statusEntity,
            CreateAt = DateTime.UtcNow
        });

        if (!string.IsNullOrWhiteSpace(request.AdminNote))
        {
            order.Note = request.AdminNote;
        }

        await _orderRepository.UpdateOrderAsync(order);

        _logger.LogInformation("Admin updated order {OrderId} status to {Status}", request.OrderId, normalizedStatus);

        return true;
    }

    private static string NormalizeStatus(string status)
    {
        var key = status.Trim().ToLower();
        return StatusMap.TryGetValue(key, out var mapped) ? mapped : status;
    }
}

