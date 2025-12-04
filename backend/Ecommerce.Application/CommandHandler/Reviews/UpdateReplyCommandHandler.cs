using Ecommerce.Application.Commands.Reviews;
using Ecommerce.Application.Common.DTOs.Reviews;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Reviews;

public class UpdateReplyCommandHandler : IRequestHandler<UpdateReplyCommand, ReviewReplyDto?>
{
    private readonly IReviewRepository _reviewRepository;

    public UpdateReplyCommandHandler(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<ReviewReplyDto?> Handle(UpdateReplyCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement if you have a reply system
        // For now, return null as this feature is not implemented
        await Task.CompletedTask;
        return null;
    }
}


