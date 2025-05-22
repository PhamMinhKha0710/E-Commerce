using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Commands.Products;
using Ecommerce.Application.Common.DTOs.Product;
using Ecommerce.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Application.CommandHandler.Products;

public class CreateProductVariantCommandHandler : IRequestHandler<CreateProductVariantCommand, ProductVariantDetailsDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<CreateProductVariantCommandHandler> _logger;

    public CreateProductVariantCommandHandler(IProductRepository productRepository, ILogger<CreateProductVariantCommandHandler> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<ProductVariantDetailsDto> Handle(CreateProductVariantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var productId = request.ProductId;
            var variantDto = request.Variant;

            // Find product
            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null)
            {
                throw new Exception($"Product with ID {productId} not found");
            }

            // Create product item for this variant
            var productItem = new ProductItem
            {
                ProductId = productId,
                SKU = variantDto.SKU,
                Price = variantDto.Price,
                OldPrice = variantDto.Price, // Use same price as OldPrice initially
                QtyInStock = variantDto.Stock,
                IsDefault = false,
                IsStatus = true
            };

            await _productRepository.AddProductItemAsync(productItem, cancellationToken);

            // For now, we'll need to simplify the variation handling since we don't have direct 
            // variation repository methods yet. In a complete implementation, we would add:
            // 1. IVariationRepository interface
            // 2. VariationRepository implementation
            // 3. Add proper methods for handling variations and options

            // Update product to indicate it has variations
            product.HasVariation = true;
            await _productRepository.UpdateAsync(product, cancellationToken);

            // Get the created variant
            var createdProductItem = await _productRepository.GetProductItemByIdAsync(productItem.Id);

            // Map to DTO
            var result = new ProductVariantDetailsDto
            {
                Id = createdProductItem.Id,
                Name = string.IsNullOrEmpty(variantDto.Name) ? 
                    string.Join(" / ", variantDto.Attributes.Select(a => a.Value)) : 
                    variantDto.Name,
                SKU = createdProductItem.SKU,
                Price = createdProductItem.Price,
                Stock = createdProductItem.QtyInStock,
                Attributes = variantDto.Attributes.Select(a => new ProductAttributeDto
                {
                    Name = a.Name,
                    Value = a.Value
                }).ToList()
            };

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product variant for product ID: {ProductId}", request.ProductId);
            throw;
        }
    }
} 