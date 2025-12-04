using Ecommerce.Application.Common.DTOs.Reviews;
using MediatR;

namespace Ecommerce.Application.Commands.Reviews;

public class UpdateReplyCommand : IRequest<ReviewReplyDto?>
{
    public int ReplyId { get; set; }
    public string Content { get; set; } = string.Empty;
}


