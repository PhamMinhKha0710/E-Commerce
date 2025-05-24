using MediatR;

namespace Ecommerce.Application.Queries;

public class GetRecommendationsQuery : IRequest<List<ProductRecommendationDto>>
{
    public int? UserId { get; set; }
    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }
    public int Limit { get; set; } = 6;
}

public class ProductRecommendationDto
{
    public int CategoryId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public string Href { get; set; }
    public string Slug { get; set; }
    public string ImageUrl { get; set; }
    public string Price { get; set; }
    public string ComparePrice { get; set; }
    public string Discount { get; set; }
    public bool HasVariations { get; set; }
    public bool Contact { get; set; }
    public int? ProductItemId { get; set; }
}