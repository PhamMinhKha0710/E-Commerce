using MediatR;

namespace Ecommerce.Application.Commands.Reviews;

public class DeleteReplyCommand : IRequest<bool>
{
    public int ReplyId { get; set; }
}


