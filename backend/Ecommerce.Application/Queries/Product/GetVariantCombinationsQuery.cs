using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Products;
public class GetVariantCombinationsQuery : IRequest<List<VariantCombinationDto>>
{
    public int ProductId { get; set; }
}