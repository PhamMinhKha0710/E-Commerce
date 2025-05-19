using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IRatingRepository
{
    // Get total rating statistics for a product
    Task<(double averageRating, int totalReviews, Dictionary<int, int> ratingDistribution)> GetProductRatingAsync(int productId);
    
    // Update product rating when a new review is added or updated
    Task UpdateProductRatingAsync(int productId);
} 