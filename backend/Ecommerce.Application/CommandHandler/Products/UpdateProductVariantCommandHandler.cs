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

public class UpdateProductVariantCommandHandler : IRequestHandler<UpdateProductVariantCommand, ProductVariantDetailsDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<UpdateProductVariantCommandHandler> _logger;

    public UpdateProductVariantCommandHandler(IProductRepository productRepository, ILogger<UpdateProductVariantCommandHandler> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<ProductVariantDetailsDto> Handle(UpdateProductVariantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var productId = request.ProductId;
            var variantId = request.VariantId;
            var variantDto = request.Variant;

            // Find product
            var product = await _productRepository.GetByIdAsync(productId, cancellationToken);

            if (product == null)
            {
                throw new Exception($"Product with ID {productId} not found");
            }

            // Find product item (variant)
            var productItem = await _productRepository.GetProductVariantByIdAsync(productId, variantId, cancellationToken);

            if (productItem == null)
            {
                throw new Exception($"Variant with ID {variantId} not found for product {productId}");
            }

            // Update product item properties
            productItem.SKU = variantDto.SKU;
            productItem.Price = variantDto.Price;
            productItem.QtyInStock = variantDto.Stock;

            // Update the product item
            await _productRepository.UpdateProductItemAsync(productItem, cancellationToken);

            // For now, we'll simplify the variant attributes handling
            // In a complete implementation, you would add:
            // 1. IVariationRepository interface 
            // 2. VariationRepository implementation
            // 3. Methods for managing variation options and configurations

            // Map to DTO
            var result = new ProductVariantDetailsDto
            {
                Id = productItem.Id,
                Name = string.IsNullOrEmpty(variantDto.Name) ? 
                    string.Join(" / ", variantDto.Attributes.Select(a => a.Value)) : 
                    variantDto.Name,
                SKU = productItem.SKU,
                Price = productItem.Price,
                Stock = productItem.QtyInStock,
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
            _logger.LogError(ex, "Error updating product variant {VariantId} for product {ProductId}", 
                request.VariantId, request.ProductId);
            throw;
        }
    }
} 