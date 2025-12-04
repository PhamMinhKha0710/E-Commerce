using Ecommerce.Application.Common.DTOs.Reviews;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Reviews;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Reviews;

public class GetAllReviewsQueryHandler : IRequestHandler<GetAllReviewsQuery, ReviewsListDto>
{
    private readonly IReviewRepository _reviewRepository;

    public GetAllReviewsQueryHandler(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<ReviewsListDto> Handle(GetAllReviewsQuery request, CancellationToken cancellationToken)
    {
        var (reviews, totalCount) = await _reviewRepository.GetAllReviewsAsync(request.Page, request.PageSize);

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            RatingValue = r.RatingValue,
            Comment = r.Comment,
            Created = r.Created,
            IsStatus = r.IsStatus,
            User = new UserMinimalDto
            {
                Id = r.User.Id,
                FirstName = r.User.FirstName ?? string.Empty,
                LastName = r.User.LastName ?? string.Empty,
                Email = r.User.Email
            },
            Product = new ProductMinimalDto
            {
                Id = r.OrderLine.ProductItem.Product.Id,
                Name = r.OrderLine.ProductItem.Product.Name,
                ImageUrl = r.OrderLine.ProductItem.Product.ProductImages.FirstOrDefault()?.ImageUrl ?? string.Empty,
                Price = r.OrderLine.ProductItem.Price
            },
            Order = new OrderMinimalDto
            {
                Id = r.OrderLine.ShopOrder.Id,
                OrderDate = r.OrderLine.ShopOrder.OrderDate
            }
        }).ToList();

        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        return new ReviewsListDto
        {
            Reviews = reviewDtos,
            TotalCount = totalCount,
            CurrentPage = request.Page,
            PageSize = request.PageSize,
            TotalPages = totalPages
        };
    }
}

