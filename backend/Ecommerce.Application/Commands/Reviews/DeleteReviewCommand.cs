using MediatR;

namespace Ecommerce.Application.Commands.Reviews;

public class DeleteReviewCommand : IRequest<bool>
{
    public int ReviewId { get; set; }
}


