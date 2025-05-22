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
using Ecommerce.Application.Interfaces.Repositories;

namespace Ecommerce.Application.CommandHandler.Products;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, AdminProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IBrandRepository _brandRepository;
    private readonly ILogger<UpdateProductCommandHandler> _logger;
    private readonly IMediator _mediator;

    public UpdateProductCommandHandler(
        IProductRepository productRepository, 
        ICategoryRepository categoryRepository,
        IBrandRepository brandRepository,
        ILogger<UpdateProductCommandHandler> logger,
        IMediator mediator)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _brandRepository = brandRepository;
        _logger = logger;
        _mediator = mediator;
    }

    public async Task<AdminProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var productDto = request.Product;
            var productId = request.Id;

            // Find product to update
            var product = await _productRepository.GetProductDetailByIdAsync(productId, cancellationToken);

            if (product == null)
            {
                throw new Exception($"Product with ID {productId} not found");
            }

            // Validate category and brand existence
            var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
            if (category == null)
            {
                throw new Exception($"Category with ID {productDto.CategoryId} not found");
            }

            var brand = await _brandRepository.GetByIdAsync(productDto.BrandId);
            if (brand == null)
            {
                throw new Exception($"Brand with ID {productDto.BrandId} not found");
            }

            // Update product properties
            product.Name = productDto.Name;
            product.Slug = string.IsNullOrEmpty(productDto.Slug) ? GenerateSlug(productDto.Name) : productDto.Slug;
            product.Description = productDto.Description;
            product.QtyInStock = productDto.Stock;
            product.ProductCategoryId = productDto.CategoryId;
            product.BrandId = productDto.BrandId;
            product.HasVariation = product.ProductItems.Count > 1 || productDto.Featured;

            // Update the product
            await _productRepository.UpdateAsync(product, cancellationToken);

            // Update default product item or create if it doesn't exist
            var productItems = await _productRepository.GetProductItemsByProductIdAsync(productId);
            var defaultProductItem = productItems.FirstOrDefault(pi => pi.IsDefault) 
                ?? productItems.FirstOrDefault();

            if (defaultProductItem != null)
            {
                defaultProductItem.SKU = productDto.SKU;
                defaultProductItem.Price = productDto.Price;
                defaultProductItem.OldPrice = productDto.SalePrice ?? productDto.Price;
                defaultProductItem.QtyInStock = productDto.Stock;
                
                await _productRepository.UpdateProductItemAsync(defaultProductItem, cancellationToken);
            }
            else
            {
                // Create default product item if none exist
                var productItem = new ProductItem
                {
                    ProductId = product.Id,
                    SKU = productDto.SKU,
                    Price = productDto.Price,
                    OldPrice = productDto.SalePrice ?? productDto.Price,
                    QtyInStock = productDto.Stock,
                    IsDefault = true,
                    IsStatus = true
                };
                await _productRepository.AddProductItemAsync(productItem, cancellationToken);
            }

            // Update product images if provided
            if (productDto.Images != null && productDto.Images.Any())
            {
                // Remove old images
                var existingImages = await _productRepository.GetProductImagesByProductIdAsync(productId, cancellationToken);

                foreach (var image in existingImages)
                {
                    await _productRepository.DeleteProductImageAsync(image, cancellationToken);
                }

                // Add new images
                foreach (var imageUrl in productDto.Images)
                {
                    var productImage = new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = imageUrl
                    };
                    await _productRepository.AddProductImageAsync(productImage, cancellationToken);
                }
            }

            // Return updated product
            return await _mediator.Send(new Queries.Products.GetAdminProductDetailQuery { Id = productId }, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product with ID: {ProductId}", request.Id);
            throw;
        }
    }

    private string GenerateSlug(string title)
    {
        // Simple slug generation - normalize to lowercase and replace spaces with hyphens
        string slug = title.ToLower().Replace(" ", "-");
        
        // Remove special characters
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
        
        // Replace multiple hyphens with a single hyphen
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-");
        
        return slug;
    }
} 