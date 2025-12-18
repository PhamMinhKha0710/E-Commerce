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

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, AdminProductDto>
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IBrandRepository _brandRepository;
    private readonly ILogger<CreateProductCommandHandler> _logger;
    private readonly IMediator _mediator;

    public CreateProductCommandHandler(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        IBrandRepository brandRepository,
        ILogger<CreateProductCommandHandler> logger,
        IMediator mediator)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _brandRepository = brandRepository;
        _logger = logger;
        _mediator = mediator;
    }

    public async Task<AdminProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var productDto = request.Product;

            // Validate category existence
            var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
            if (category == null)
            {
                throw new Exception($"Category with ID {productDto.CategoryId} not found");
            }

            // Validate brand existence
            var brand = await _brandRepository.GetByIdAsync(productDto.BrandId);
            if (brand == null)
            {
                throw new Exception($"Brand with ID {productDto.BrandId} not found");
            }

            // Generate slug if not provided
            if (string.IsNullOrEmpty(productDto.Slug))
            {
                productDto.Slug = GenerateSlug(productDto.Name);
            }

            // Create new product entity
            var product = new Product
            {
                Name = productDto.Name,
                Slug = productDto.Slug,
                Description = productDto.Description ?? string.Empty,
                QtyInStock = productDto.Stock,
                ProductCategoryId = productDto.CategoryId,
                BrandId = productDto.BrandId,
                HasVariation = false,
                Currency = "VND", // Explicitly set Currency (required field with default)
                Suggestion = string.Empty, // Initialize to avoid null issues
                // ElasticsearchId là cột NOT NULL trong DB, gán tạm rỗng; 
                // sẽ được cập nhật sau khi đồng bộ Elasticsearch
                ElasticsearchId = string.Empty
            };

            // Add the product
            await _productRepository.AddAsync(product, cancellationToken);

            // Get first image URL for ProductItem (ImageUrl is required)
            var firstImageUrl = productDto.Images != null && productDto.Images.Any() 
                ? productDto.Images.First() 
                : string.Empty;

            // Create default product item
            var productItem = new ProductItem
            {
                ProductId = product.Id,
                SKU = productDto.SKU,
                Price = productDto.Price,
                OldPrice = productDto.SalePrice ?? productDto.Price,
                QtyInStock = productDto.Stock,
                ImageUrl = firstImageUrl, // ImageUrl is required in ProductItem
                IsDefault = true,
                IsStatus = true
            };

            // Add the product item
            await _productRepository.AddProductItemAsync(productItem, cancellationToken);

            // Add product images
            if (productDto.Images != null && productDto.Images.Any())
            {
                foreach (var imageUrl in productDto.Images)
                {
                    var productImage = new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = imageUrl
                    };
                    // Add each image
                    await _productRepository.AddProductImageAsync(productImage, cancellationToken);
                }
            }

            // Retrieve the created product details to return
            return await _mediator.Send(new Queries.Products.GetAdminProductDetailQuery { Id = product.Id }, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
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