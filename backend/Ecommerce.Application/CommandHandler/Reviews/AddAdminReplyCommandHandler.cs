using Ecommerce.Application.Commands.Reviews;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Reviews;

public class AddAdminReplyCommandHandler : IRequestHandler<AddAdminReplyCommand, bool>
{
    private readonly IReviewRepository _reviewRepository;

    public AddAdminReplyCommandHandler(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<bool> Handle(AddAdminReplyCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement if you have a reply system
        // For now, return false as this feature is not implemented
        await Task.CompletedTask;
        return false;
    }
}


