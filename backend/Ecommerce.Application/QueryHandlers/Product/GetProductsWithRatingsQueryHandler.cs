using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.QueryHandlers.Products;

public class GetProductsWithRatingsQueryHandler : IRequestHandler<GetProductsWithRatingsQuery, ProductsWithRatingListDto>
{
    private readonly IProductRepository _productRepository;
    private readonly IRatingRepository _ratingRepository;

    public GetProductsWithRatingsQueryHandler(
        IProductRepository productRepository,
        IRatingRepository ratingRepository)
    {
        _productRepository = productRepository;
        _ratingRepository = ratingRepository;
    }

    public async Task<ProductsWithRatingListDto> Handle(GetProductsWithRatingsQuery request, CancellationToken cancellationToken)
    {
        // Start with a base query
        var query = _productRepository.Query();
        
        // Apply includes
        query = query.Include(p => p.ProductCategory)
                     .Include(p => p.Brand)
                     .Include(p => p.ProductImages)
                     .Include(p => p.ProductItems);

        // Apply filters
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(p => p.ProductCategory.Name.Contains(request.Category));
        }

        if (!string.IsNullOrEmpty(request.Brand))
        {
            query = query.Where(p => p.Brand.Name.Contains(request.Brand));
        }

        if (request.MinPrice.HasValue)
        {
            query = query.Where(p => p.ProductItems.Any(pi => pi.Price >= (decimal)request.MinPrice.Value));
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(p => p.ProductItems.Any(pi => pi.Price <= (decimal)request.MaxPrice.Value));
        }

        // Get total count
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply sorting - use a variable to hold IQueryable<Product>
        var orderedQuery = query;
        
        switch (request.SortBy.ToLower())
        {
            case "price":
                orderedQuery = request.SortDesc
                    ? query.OrderByDescending(p => p.ProductItems.Min(pi => pi.Price))
                    : query.OrderBy(p => p.ProductItems.Min(pi => pi.Price));
                break;
            case "name":
                orderedQuery = request.SortDesc
                    ? query.OrderByDescending(p => p.Name)
                    : query.OrderBy(p => p.Name);
                break;
            case "newest":
                orderedQuery = request.SortDesc
                    ? query.OrderByDescending(p => p.Id)
                    : query.OrderBy(p => p.Id);
                break;
            case "rating":
                orderedQuery = request.SortDesc
                    ? query.OrderByDescending(p => p.Rating)
                    : query.OrderBy(p => p.Rating);
                break;
            default:
                orderedQuery = query.OrderByDescending(p => p.Rating);
                break;
        }

        // Apply pagination
        var products = await orderedQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        // Map to DTOs
        var productDtos = new List<ProductWithRatingDto>();
        foreach (var product in products)
        {
            var defaultProductItem = product.ProductItems.FirstOrDefault(pi => pi.IsDefault) 
                ?? product.ProductItems.FirstOrDefault();

            productDtos.Add(new ProductWithRatingDto
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Description = product.Description,
                Category = product.ProductCategory?.Name ?? string.Empty,
                Brand = product.Brand?.Name ?? string.Empty,
                ImageUrl = defaultProductItem?.ImageUrl ?? product.ProductImages.FirstOrDefault()?.ImageUrl ?? string.Empty,
                Price = defaultProductItem?.Price ?? 0,
                OldPrice = defaultProductItem?.OldPrice ?? 0,
                Currency = product.Currency,
                HasVariation = product.HasVariation,
                QtyInStock = product.QtyInStock,
                AverageRating = product.Rating,
                TotalReviews = product.TotalRatingCount
            });
        }

        // Get distinct categories and brands for filters
        var categories = await _productRepository.Query()
            .Where(p => p.ProductCategory != null)
            .Select(p => p.ProductCategory.Name)
            .Distinct()
            .ToListAsync(cancellationToken);

        var brands = await _productRepository.Query()
            .Where(p => p.Brand != null)
            .Select(p => p.Brand.Name)
            .Distinct()
            .ToListAsync(cancellationToken);

        // Get min and max price for filters
        var minPrice = await _productRepository.Query()
            .SelectMany(p => p.ProductItems)
            .MinAsync(pi => pi.Price as decimal?, cancellationToken) ?? 0;

        var maxPrice = await _productRepository.Query()
            .SelectMany(p => p.ProductItems)
            .MaxAsync(pi => pi.Price as decimal?, cancellationToken) ?? 0;

        return new ProductsWithRatingListDto
        {
            Products = productDtos,
            TotalCount = totalCount,
            CurrentPage = request.Page,
            PageSize = request.PageSize,
            Categories = categories,
            Brands = brands,
            MinPrice = minPrice,
            MaxPrice = maxPrice
        };
    }
} 