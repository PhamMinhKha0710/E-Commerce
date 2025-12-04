using Ecommerce.Application.Common.DTOs.Reviews;
using MediatR;

namespace Ecommerce.Application.Queries.Reviews;

public class GetAllReviewsQuery : IRequest<ReviewsListDto>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}


