using Ecommerce.Application.Commands.Reviews;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Reviews;

public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, bool>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IRatingRepository _ratingRepository;

    public DeleteReviewCommandHandler(
        IReviewRepository reviewRepository,
        IRatingRepository ratingRepository)
    {
        _reviewRepository = reviewRepository;
        _ratingRepository = ratingRepository;
    }

    public async Task<bool> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(request.ReviewId);
        if (review == null)
            return false;

        var productId = review.OrderLine.ProductItem.Product.Id;
        var result = await _reviewRepository.DeleteReviewAsync(request.ReviewId);
        
        if (result)
        {
            // Update product rating after deleting review
            await _ratingRepository.UpdateProductRatingAsync(productId);
        }
        
        return result;
    }
}


