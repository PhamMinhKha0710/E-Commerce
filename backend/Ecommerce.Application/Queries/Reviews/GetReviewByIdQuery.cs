using Ecommerce.Application.Common.DTOs.Reviews;
using MediatR;

namespace Ecommerce.Application.Queries.Reviews;

public class GetReviewByIdQuery : IRequest<ReviewDetailDto?>
{
    public int ReviewId { get; set; }
}


