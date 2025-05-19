using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Ratings;

public class GetProductRatingQueryHandler : IRequestHandler<GetProductRatingQuery, ProductRatingDto>
{
    private readonly IRatingRepository _ratingRepository;

    public GetProductRatingQueryHandler(IRatingRepository ratingRepository)
    {
        _ratingRepository = ratingRepository;
    }

    public async Task<ProductRatingDto> Handle(GetProductRatingQuery request, CancellationToken cancellationToken)
    {
        var (averageRating, totalReviews, ratingDistribution) = 
            await _ratingRepository.GetProductRatingAsync(request.ProductId);

        return new ProductRatingDto
        {
            ProductId = request.ProductId,
            AverageRating = averageRating,
            TotalReviews = totalReviews,
            RatingsDistribution = ratingDistribution
        };
    }
} 