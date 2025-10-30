using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Persistence.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(List<UserReview> reviews, int totalCount)> GetAllReviewsAsync(int page, int pageSize)
    {
        var query = _context.UserReviews
            .Include(r => r.User)
            .Include(r => r.OrderLine)
                .ThenInclude(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product)
                        .ThenInclude(p => p.ProductImages)
            .Include(r => r.OrderLine)
                .ThenInclude(ol => ol.ShopOrder)
            .OrderByDescending(r => r.Created);

        var totalCount = await query.CountAsync();
        
        var reviews = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (reviews, totalCount);
    }

    public async Task<UserReview?> GetReviewByIdAsync(int reviewId)
    {
        return await _context.UserReviews
            .Include(r => r.User)
            .Include(r => r.OrderLine)
                .ThenInclude(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product)
                        .ThenInclude(p => p.ProductImages)
            .Include(r => r.OrderLine)
                .ThenInclude(ol => ol.ShopOrder)
            .FirstOrDefaultAsync(r => r.Id == reviewId);
    }

    public async Task<bool> UpdateReviewStatusAsync(int reviewId, bool isStatus)
    {
        var review = await _context.UserReviews.FindAsync(reviewId);
        
        if (review == null)
            return false;

        review.IsStatus = isStatus;
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> DeleteReviewAsync(int reviewId)
    {
        var review = await _context.UserReviews.FindAsync(reviewId);
        
        if (review == null)
            return false;

        _context.UserReviews.Remove(review);
        await _context.SaveChangesAsync();
        
        return true;
    }
}


