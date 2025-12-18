using MediatR;

namespace Ecommerce.Application.Commands.Orders;

public class UpdateAdminOrderNoteCommand : IRequest<bool>
{
    public int OrderId { get; set; }
    public string Note { get; set; } = string.Empty;
}






















































