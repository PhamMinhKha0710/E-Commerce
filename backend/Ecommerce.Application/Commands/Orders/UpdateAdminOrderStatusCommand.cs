using Ecommerce.Application.Common.DTOs.Order.Admin;
using MediatR;

namespace Ecommerce.Application.Commands.Orders;

public class UpdateAdminOrderStatusCommand : IRequest<bool>
{
    public int OrderId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? AdminNote { get; set; }
    public bool NotifyCustomer { get; set; }
}













