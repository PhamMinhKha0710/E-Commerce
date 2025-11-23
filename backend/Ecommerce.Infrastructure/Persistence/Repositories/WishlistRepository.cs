using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Persistence.Repositories;

public class WishlistRepository : IWishlistRepository
{
    private readonly AppDbContext _context;

    public WishlistRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<WishlistItem>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.WishlistItems
            .AsSplitQuery()
            .Where(w => w.UserId == userId)
            .Include(w => w.Product)
                .ThenInclude(p => p.ProductItems)
            .Include(w => w.Product)
                .ThenInclude(p => p.ProductImages)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<WishlistItem?> GetItemAsync(int userId, int productId, CancellationToken cancellationToken = default)
    {
        return await _context.WishlistItems
            .Include(w => w.Product)
                .ThenInclude(p => p.ProductItems)
            .Include(w => w.Product)
                .ThenInclude(p => p.ProductImages)
            .FirstOrDefaultAsync(
                w => w.UserId == userId && w.ProductId == productId,
                cancellationToken);
    }

    public async Task AddAsync(WishlistItem wishlistItem, CancellationToken cancellationToken = default)
    {
        await _context.WishlistItems.AddAsync(wishlistItem, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveAsync(WishlistItem wishlistItem, CancellationToken cancellationToken = default)
    {
        _context.WishlistItems.Remove(wishlistItem);
        await _context.SaveChangesAsync(cancellationToken);
    }
}












