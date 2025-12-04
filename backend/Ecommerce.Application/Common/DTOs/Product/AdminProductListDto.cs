using System.Collections.Generic;

namespace Ecommerce.Application.Common.DTOs.Product;

public class AdminProductListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Status { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}

public class AdminProductListItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal SalePrice { get; set; }
    public int Stock { get; set; }
    public string Status { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public bool HasVariants { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class PaginatedList<T>
{
    public List<T> Items { get; set; }
    public int PageIndex { get; set; }
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
}

public class CategoryFilterOption
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class BrandFilterOption
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class AdminProductListResponse
{
    public List<AdminProductListItemDto> Products { get; set; }
    public List<string> Categories { get; set; } = new List<string>();
    public List<string> Brands { get; set; } = new List<string>();
    public List<CategoryFilterOption> CategoryOptions { get; set; } = new List<CategoryFilterOption>();
    public List<BrandFilterOption> BrandOptions { get; set; } = new List<BrandFilterOption>();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
} 