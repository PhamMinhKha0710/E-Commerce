using Ecommerce.Application.Common.DTOs.Product;
using MediatR;

namespace Ecommerce.Application.Queries.Products;
 
public class GetProductVariantDetailQuery : IRequest<ProductVariantDetailsDto>
{
    public int ProductId { get; set; }
    public int VariantId { get; set; }
} 