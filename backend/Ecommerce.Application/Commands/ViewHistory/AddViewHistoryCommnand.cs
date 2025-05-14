using MediatR;

namespace Ecommerce.Application.Commands;

public class AddViewHistoryCommand : IRequest<bool>
{
    public int ProductId {get; set;}
}