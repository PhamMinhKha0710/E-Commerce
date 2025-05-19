using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries;
 
public class GetProductRatingQuery : IRequest<ProductRatingDto>
{
    public int ProductId { get; set; }
} 