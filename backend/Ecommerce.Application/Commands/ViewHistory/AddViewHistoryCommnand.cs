using MediatR;

namespace Ecommerce.Application.Commands;

public class AddViewHistoryCommand : IRequest<bool>
{
    public int? UserId {get; set;}
    public int ProductId {get; set;}
}