// Ecommerce.Infrastructure/Repositories/PopularityStatRepository.cs
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;
public class PopularityStatRepository : IPopularityStatRepository
{
    private readonly AppDbContext _dbContext;

    public PopularityStatRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Product>> GetPopularProductsAsync(int? categoryId, int limit)
    {
        var query = _dbContext.PopularityStats
            .Where(ps => ps.TimePeriod >= DateTime.Now.AddDays(-7));

        if (categoryId.HasValue)
        {
            query = query.Where(ps => ps.CategoryId == categoryId.Value);
        }

        query = query.OrderByDescending(ps => ps.ViewCount * 0.4 + ps.PurchaseCount * 0.6);

        var products = await query
            .Take(limit)
            .Select(ps => ps.Product)
            .ToListAsync();

        if (!products.Any())
        {
            products = await _dbContext.Products
                .Include(p => p.ProductItems.Where(pi => pi.IsDefault))
                .Where(p => categoryId == null || p.ProductCategoryId == categoryId)
                .OrderByDescending(p => p.ProductItems.FirstOrDefault().Price)
                .Take(limit)
                .ToListAsync();
        }

        return products;
    }
}