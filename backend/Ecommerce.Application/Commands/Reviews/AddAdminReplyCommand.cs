using MediatR;

namespace Ecommerce.Application.Commands.Reviews;

public class AddAdminReplyCommand : IRequest<bool>
{
    public int ReviewId { get; set; }
    public string Content { get; set; } = string.Empty;
}


