using MediatR;

namespace Ecommerce.Application.Commands.Reviews;

public class UpdateReviewStatusCommand : IRequest<bool>
{
    public int ReviewId { get; set; }
    public bool IsStatus { get; set; }
}


