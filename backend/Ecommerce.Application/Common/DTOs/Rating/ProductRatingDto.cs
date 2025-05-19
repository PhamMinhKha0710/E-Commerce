namespace Ecommerce.Application.Common.DTOs;

public record ProductRatingDto
{
    public int ProductId { get; init; }
    public double AverageRating { get; init; }
    public int TotalReviews { get; init; }
    public Dictionary<int, int> RatingsDistribution { get; init; } = new Dictionary<int, int>();
} 