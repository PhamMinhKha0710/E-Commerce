using Nest;
namespace Ecommerce.Application.Common.DTOs 
{
    public class ProductSearchRequestDto
    {
        public string Query { get; set; }
        public ProductSearchFilters Filters { get; set; }
        public string Sort { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class ProductSearchFilters
    {
        public List<string> Category { get; set; }
        public List<string> SubCategory { get; set; }
        public PriceRange PriceRange { get; set; }
        public List<string> Brand { get; set; }
        public List<VariationFilter> Variations { get; set; }
    }

    public class PriceRange
    {
        public double Min { get; set; }
        public double Max { get; set; }
    }

    public class VariationFilter
    {
        public int? OptionId { get; set; }
        public string OptionValue { get; set; }
        public int? VariationId { get; set; }
        public string VariationValue { get; set; }
    }

    public class ProductSearchResponseDto
    {
        public long Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public List<ProductItemDto> Results { get; set; }
    }

    public class ProductItemDto
    {
        [PropertyName("product_id")]
        public int ProductId { get; set; }

        [PropertyName("item_id")]
        public int ItemId { get; set; }

        [PropertyName("name")]
        public string Name { get; set; }

        [PropertyName("description")]
        public string Description { get; set; }

        [PropertyName("category")]
        public string Category { get; set; }

        [PropertyName("sub_category")]
        public string SubCategory { get; set; }

        [PropertyName("brand")]
        public string Brand { get; set; }

        [PropertyName("price")]
        public double Price { get; set; }

        [PropertyName("old_price")]
        public double? OldPrice { get; set; }

        [PropertyName("stock")]
        public int Stock { get; set; }

        [PropertyName("sku")]
        public string Sku { get; set; }

        [PropertyName("image_url")]
        public string ImageUrl { get; set; }

        [PropertyName("popularity_score")]
        public float PopularityScore { get; set; }

        [PropertyName("has_variation")]
        public bool HasVariation { get; set; }

        [PropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [PropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [PropertyName("tags")]
        public List<string> Tags { get; set; }

        [PropertyName("rating")]
        public float Rating { get; set; }

        [PropertyName("total_rating_count")]
        public int TotalRatingCount { get; set; }

        [PropertyName("status")]
        public bool Status { get; set; }
    }

    public class SuggestResponseDto
    {
        public List<string> Suggestions { get; set; }
        public List<string> ProductNames { get; set; }
        public List<string> Urls { get; set; } // New field for URLs
    }

    public class ErrorResponseDto
    {
        public string Message { get; set; }
    }
}