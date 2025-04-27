using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Queries.Products;
using MediatR;
using Microsoft.EntityFrameworkCore; 

namespace Ecommerce.Application.QueryHandlers.Products
{
    public class GetVariantCombinationsQueryHandler : IRequestHandler<GetVariantCombinationsQuery, List<VariantCombinationDto>>
    {
        private readonly IProductRepository _productRepository;

        public GetVariantCombinationsQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<VariantCombinationDto>> Handle(GetVariantCombinationsQuery request, CancellationToken cancellationToken)
        {
            var product = await _productRepository
                .Query()
                .Include(p => p.ProductItems)
                .ThenInclude(pi => pi.ProductConfigurations)
                .ThenInclude(pc => pc.VariationOption)
                .ThenInclude(vo => vo.Variation)
                .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

            if (product == null || !product.HasVariation)
            {
                return new List<VariantCombinationDto>();
            }

            var variantCombinations = product.ProductItems.Select(pi => new VariantCombinationDto
            {
                Id = pi.Id.ToString(),
                Attributes = pi.ProductConfigurations.ToDictionary(
                    pc => pc.VariationOption.Variation.Value,
                    pc => pc.VariationOption.Value
                ),
                Price = (decimal)pi.Price,
                OldPrice = (decimal)pi.OldPrice,
                Available = pi.QtyInStock > 0
            }).ToList();

            return variantCombinations;
        }
    }
}