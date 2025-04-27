using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Products;
public class GetProductDetailQuery : IRequest<ProductDetailDto>
{
    public int Id { get; set; }
}