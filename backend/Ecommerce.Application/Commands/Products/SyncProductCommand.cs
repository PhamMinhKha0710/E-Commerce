using MediatR;

namespace Ecommerce.Application.Command;

public class SyncProductCommand : IRequest<Unit>
{
    public int ProductId { get; set; }
    public string Action { get; set; } // action "add", "update", "delete"
}