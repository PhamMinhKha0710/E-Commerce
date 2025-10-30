using Ecommerce.Application.Common.DTOs.Reviews;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Reviews;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Reviews;

public class GetReviewByIdQueryHandler : IRequestHandler<GetReviewByIdQuery, ReviewDetailDto?>
{
    private readonly IReviewRepository _reviewRepository;

    public GetReviewByIdQueryHandler(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<ReviewDetailDto?> Handle(GetReviewByIdQuery request, CancellationToken cancellationToken)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(request.ReviewId);

        if (review == null)
            return null;

        return new ReviewDetailDto
        {
            Id = review.Id,
            RatingValue = review.RatingValue,
            Comment = review.Comment,
            Created = review.Created,
            IsStatus = review.IsStatus,
            User = new UserMinimalDto
            {
                Id = review.User.Id,
                FirstName = review.User.FirstName ?? string.Empty,
                LastName = review.User.LastName ?? string.Empty,
                Email = review.User.Email
            },
            Product = new ProductMinimalDto
            {
                Id = review.OrderLine.ProductItem.Product.Id,
                Name = review.OrderLine.ProductItem.Product.Name,
                ImageUrl = review.OrderLine.ProductItem.Product.ProductImages.FirstOrDefault()?.ImageUrl ?? string.Empty,
                Price = review.OrderLine.ProductItem.Price
            },
            Order = new OrderMinimalDto
            {
                Id = review.OrderLine.ShopOrder.Id,
                OrderDate = review.OrderLine.ShopOrder.OrderDate
            },
            HelpfulCount = 0, // TODO: Implement if needed
            UnhelpfulCount = 0, // TODO: Implement if needed
            IsVerifiedPurchase = true, // Always true since review is linked to order
            Replies = new List<ReviewReplyDto>() // TODO: Implement if needed
        };
    }
}

