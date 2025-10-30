using Ecommerce.Application.Commands.Reviews;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Reviews;

public class UpdateReviewStatusCommandHandler : IRequestHandler<UpdateReviewStatusCommand, bool>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IRatingRepository _ratingRepository;

    public UpdateReviewStatusCommandHandler(
        IReviewRepository reviewRepository,
        IRatingRepository ratingRepository)
    {
        _reviewRepository = reviewRepository;
        _ratingRepository = ratingRepository;
    }

    public async Task<bool> Handle(UpdateReviewStatusCommand request, CancellationToken cancellationToken)
    {
        var result = await _reviewRepository.UpdateReviewStatusAsync(request.ReviewId, request.IsStatus);
        
        if (result)
        {
            // Update product rating after changing review status
            var review = await _reviewRepository.GetReviewByIdAsync(request.ReviewId);
            if (review != null)
            {
                var productId = review.OrderLine.ProductItem.Product.Id;
                await _ratingRepository.UpdateProductRatingAsync(productId);
            }
        }
        
        return result;
    }
}


