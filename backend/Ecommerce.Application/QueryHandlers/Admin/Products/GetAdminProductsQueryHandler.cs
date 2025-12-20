using Ecommerce.Application.Queries.Products;
using Ecommerce.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Common.DTOs.Product;
using System;
using System.Linq;

namespace Ecommerce.Application.QueryHandlers.Admin.Products;

public class GetAdminProductsQueryHandler : IRequestHandler<GetAdminProductsQuery, AdminProductListResponse>
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<GetAdminProductsQueryHandler> _logger;

    public GetAdminProductsQueryHandler(
        IProductRepository productRepository,
        ILogger<GetAdminProductsQueryHandler> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<AdminProductListResponse> Handle(GetAdminProductsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Get paginated products with all necessary includes
            var (products, totalCount) = await _productRepository.GetPaginatedProductsAsync(
                request.PageNumber,
                request.PageSize,
                request.SortBy,
                request.CategoryId,
                request.BrandId,
                request.Status,
                request.MinPrice,
                request.MaxPrice,
                cancellationToken);

            // Map to DTOs with null safety
            var productDtos = products.Select(p => 
            {
                try
                {
                    var defaultItem = p.ProductItems?.FirstOrDefault(pi => pi != null && pi.IsDefault) 
                        ?? p.ProductItems?.FirstOrDefault(pi => pi != null);

                    return new AdminProductListItemDto
                    {
                        Id = p.Id,
                        Name = p.Name ?? string.Empty,
                        Slug = p.Slug ?? string.Empty,
                        SKU = defaultItem?.SKU ?? string.Empty,
                        Price = defaultItem?.Price ?? 0,
                        SalePrice = defaultItem?.OldPrice ?? 0,
                        Stock = p.QtyInStock,
                        Status = p.QtyInStock > 0 ? "In Stock" : "Out of Stock",
                        CategoryId = p.ProductCategoryId,
                        CategoryName = p.ProductCategory?.Name ?? string.Empty,
                        BrandId = p.BrandId,
                        BrandName = p.Brand?.Name ?? string.Empty,
                        HasVariants = p.HasVariation,
                        ImageUrl = (p.ProductImages?.FirstOrDefault(img => img != null))?.ImageUrl ?? string.Empty
                    };
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error mapping product {ProductId} to DTO", p.Id);
                    // Return a safe default DTO
                    return new AdminProductListItemDto
                    {
                        Id = p.Id,
                        Name = p.Name ?? "Unknown",
                        Slug = p.Slug ?? string.Empty,
                        SKU = string.Empty,
                        Price = 0,
                        SalePrice = 0,
                        Stock = p.QtyInStock,
                        Status = "Unknown",
                        CategoryId = 0,
                        CategoryName = string.Empty,
                        BrandId = 0,
                        BrandName = string.Empty,
                        HasVariants = false,
                        ImageUrl = string.Empty
                    };
                }
            }).ToList();

            // Get filter options
            var (categories, brands) = await _productRepository.GetProductFilterOptionsAsync(cancellationToken);
            var (categoryOptions, brandOptions) = await _productRepository.GetProductFilterOptionsWithIdsAsync(cancellationToken);

            return new AdminProductListResponse
            {
                Products = productDtos,
                Categories = categories,
                Brands = brands,
                CategoryOptions = categoryOptions.Select(c => new CategoryFilterOption { Id = c.Id, Name = c.Name }).ToList(),
                BrandOptions = brandOptions.Select(b => new BrandFilterOption { Id = b.Id, Name = b.Name }).ToList(),
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving admin products list. PageNumber: {PageNumber}, PageSize: {PageSize}, SortBy: {SortBy}, CategoryId: {CategoryId}, BrandId: {BrandId}, Status: {Status}", 
                request.PageNumber, request.PageSize, request.SortBy, request.CategoryId, request.BrandId, request.Status);
            _logger.LogError(ex, "Exception details: {Message}, StackTrace: {StackTrace}", ex.Message, ex.StackTrace);
            throw;
        }
    }
} 