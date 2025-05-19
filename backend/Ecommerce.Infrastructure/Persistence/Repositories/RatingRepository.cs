using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence; 
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Persistence.Repositories;

public class RatingRepository : IRatingRepository
{
    private readonly AppDbContext _context;

    public RatingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(double averageRating, int totalReviews, Dictionary<int, int> ratingDistribution)> GetProductRatingAsync(int productId)
    {
        // Get all approved reviews for the specified product
        var reviews = await _context.UserReviews
            .Include(r => r.OrderLine)
            .ThenInclude(ol => ol.ProductItem)
            .Where(r => r.OrderLine.ProductItem.ProductId == productId && r.IsStatus)
            .ToListAsync();

        // Calculate the average rating and total review count
        var totalReviews = reviews.Count;
        var averageRating = totalReviews > 0 
            ? reviews.Average(r => r.RatingValue) 
            : 0;

        // Calculate the rating distribution (how many reviews for each star rating)
        var ratingDistribution = new Dictionary<int, int>();
        for (int i = 1; i <= 5; i++)
        {
            ratingDistribution[i] = reviews.Count(r => r.RatingValue == i);
        }

        return (averageRating, totalReviews, ratingDistribution);
    }

    public async Task UpdateProductRatingAsync(int productId)
    {
        // Get the product
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
        {
            return;
        }

        // Get all approved reviews for the product
        var reviews = await _context.UserReviews
            .Include(r => r.OrderLine)
            .ThenInclude(ol => ol.ProductItem)
            .Where(r => r.OrderLine.ProductItem.ProductId == productId && r.IsStatus)
            .ToListAsync();

        // Calculate the average rating
        var totalReviews = reviews.Count;
        int averageRating = 0;
        
        if (totalReviews > 0)
        {
            // Calculate the average and round to nearest integer for storage in DB
            averageRating = (int)Math.Round(reviews.Average(r => r.RatingValue));
        }

        // Update the product
        product.Rating = averageRating;
        product.TotalRatingCount = totalReviews;
        
        await _context.SaveChangesAsync();
    }
} 