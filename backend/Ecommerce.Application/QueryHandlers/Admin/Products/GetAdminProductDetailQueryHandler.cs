using Ecommerce.Application.Common.DTOs.Product;
using Ecommerce.Application.Queries.Products;
using Ecommerce.Domain.Entities;
using Ecommerce.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.QueryHandlers.Admin.Products;

public class GetAdminProductDetailQueryHandler : IRequestHandler<GetAdminProductDetailQuery, AdminProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<GetAdminProductDetailQueryHandler> _logger;

    public GetAdminProductDetailQueryHandler(
        IProductRepository productRepository,
        ILogger<GetAdminProductDetailQueryHandler> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<AdminProductDto> Handle(GetAdminProductDetailQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var product = await _productRepository.GetProductDetailByIdAsync(request.Id, cancellationToken);

            if (product == null)
            {
                throw new Exception($"Product with ID {request.Id} not found");
            }

            // Get the default product item
            var defaultProductItem = product.ProductItems
                .FirstOrDefault(pi => pi.IsDefault) ?? product.ProductItems.FirstOrDefault();

            if (defaultProductItem == null)
            {
                throw new Exception($"No product items found for product with ID {request.Id}");
            }

            // Get product variants
            var productVariants = await _productRepository.GetProductVariantsAsync(product.Id, cancellationToken);
                
            // Map variants to AdminProductVariantDto
            var variants = productVariants.Select(pi => new AdminProductVariantDto
            {
                Id = pi.Id,
                SKU = pi.SKU,
                Price = pi.Price,
                Stock = pi.QtyInStock,
                Name = pi.ProductConfigurations?.FirstOrDefault()?.VariationOption?.Value ?? "",
                Attributes = (pi.ProductConfigurations ?? new List<ProductConfiguration>())
                    .Select(pc => new AdminProductAttributeDto 
                    { 
                        Name = pc.VariationOption?.Variation?.Value ?? string.Empty,
                        Value = pc.VariationOption?.Value ?? string.Empty 
                    })
                    .ToList()
            }).ToList();

            // Map product to DTO
            var productDto = new AdminProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Description = product.Description,
                CategoryId = product.ProductCategoryId,
                Category = product.ProductCategory?.Name ?? string.Empty,
                CategoryName = product.ProductCategory?.Name ?? string.Empty,
                BrandId = product.BrandId,
                Brand = product.Brand?.Name ?? string.Empty,
                BrandName = product.Brand?.Name ?? string.Empty,
                SKU = defaultProductItem.SKU,
                Price = defaultProductItem.Price,
                SalePrice = defaultProductItem.OldPrice,
                Stock = product.QtyInStock,
                Status = product.QtyInStock > 0 ? "In Stock" : "Out of Stock",
                Featured = product.HasVariation,
                HasVariations = product.HasVariation,
                Images = product.ProductImages.Select(pi => pi.ImageUrl).ToList(),
                Variants = variants
            };

            return productDto;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product with ID: {ProductId}", request.Id);
            throw;
        }
    }
} 