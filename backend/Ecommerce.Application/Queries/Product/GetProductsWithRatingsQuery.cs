using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Products;

public class GetProductsWithRatingsQuery : IRequest<ProductsWithRatingListDto>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Category { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string SortBy { get; set; } = "rating"; // "rating", "price", "name", "newest"
    public bool SortDesc { get; set; } = true;
} 