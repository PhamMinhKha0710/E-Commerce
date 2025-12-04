using Ecommerce.Application.Common.DTOs.Product;
using MediatR;

namespace Ecommerce.Application.Queries.Products;
 
public class GetAdminProductsQuery : IRequest<AdminProductListResponse>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public int? CategoryId { get; set; }
    public int? BrandId { get; set; }
    public string? Status { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
} 