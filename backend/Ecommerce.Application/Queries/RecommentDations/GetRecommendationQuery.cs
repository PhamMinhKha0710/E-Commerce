
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
    public int Id { get; set; }
    public string Name { get; set; }
    public int ProductCategoryId { get; set; }
    public decimal Price { get; set; }
}