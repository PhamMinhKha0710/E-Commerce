namespace Ecommerce.Application.Common.DTOs;

public class ProductWithRatingDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal OldPrice { get; set; }
    public string Currency { get; set; } = "VND";
    public bool HasVariation { get; set; }
    public int QtyInStock { get; set; }
    
    // Rating information
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
}

public class ProductsWithRatingListDto
{
    public List<ProductWithRatingDto> Products { get; set; } = new List<ProductWithRatingDto>();
    public int TotalCount { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    
    // Filter metadata
    public List<string> Categories { get; set; } = new List<string>();
    public List<string> Brands { get; set; } = new List<string>();
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
} 