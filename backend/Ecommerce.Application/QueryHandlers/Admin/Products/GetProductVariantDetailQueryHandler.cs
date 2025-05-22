using Ecommerce.Application.Common.DTOs.Product;
using Ecommerce.Application.Queries.Products;
using MediatR;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Application.QueryHandlers.Admin.Products;

public class GetProductVariantDetailQueryHandler : IRequestHandler<GetProductVariantDetailQuery, ProductVariantDetailsDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<GetProductVariantDetailQueryHandler> _logger;

    public GetProductVariantDetailQueryHandler(
        IProductRepository productRepository,
        ILogger<GetProductVariantDetailQueryHandler> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<ProductVariantDetailsDto> Handle(GetProductVariantDetailQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var productId = request.ProductId;
            var variantId = request.VariantId;

            // Find product variant (product item)
            var productItem = await _productRepository.GetProductVariantByIdAsync(productId, variantId, cancellationToken);

            if (productItem == null)
            {
                throw new Exception($"Variant with ID {variantId} not found for product {productId}");
            }

            // Map to DTO
            var variantDto = new ProductVariantDetailsDto
            {
                Id = productItem.Id,
                Name = string.Join(" / ", productItem.ProductConfigurations
                    .Select(pc => pc.VariationOption?.Value ?? string.Empty)),
                SKU = productItem.SKU,
                Price = productItem.Price,
                Stock = productItem.QtyInStock,
                Attributes = productItem.ProductConfigurations
                    .Select(pc => new ProductAttributeDto
                    {
                        Name = pc.VariationOption?.Variation?.Value ?? string.Empty,
                        Value = pc.VariationOption?.Value ?? string.Empty
                    })
                    .ToList()
            };

            return variantDto;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving variant {VariantId} for product {ProductId}", 
                request.VariantId, request.ProductId);
            throw;
        }
    }
} 