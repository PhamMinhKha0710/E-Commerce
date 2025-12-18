// Ecommerce.Infrastructure/Repositories/ProductSimilarityRepository.cs
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace Ecommerce.Infrastructure.Repositories;
public class ProductSimilarityRepository : IProductSimilarityRepository
{
    private readonly AppDbContext _dbContext;

    public ProductSimilarityRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Product>> GetSimilarProductsAsync(List<int> productIds, int limit)
    {
        var scores = await _dbContext.ProductSimilarities
            .Where(ps => productIds.Contains(ps.ProductId1) || productIds.Contains(ps.ProductId2))
            .Select(ps => new
            {
                OtherId = productIds.Contains(ps.ProductId1) ? ps.ProductId2 : ps.ProductId1,
                ps.Similarity
            })
            .GroupBy(x => x.OtherId)
            .Select(g => new { ProductId = g.Key, Score = g.Max(x => x.Similarity) })
            .OrderByDescending(x => x.Score)
            .Take(limit)
            .ToListAsync();

        return scores.Select(s => new Product { Id = s.ProductId }).ToList();
    }

    public async Task AddRangeAsync(List<ProductSimilarity> similarities)
    {
        await _dbContext.ProductSimilarities.AddRangeAsync(similarities);
        await _dbContext.SaveChangesAsync();
    }

    public async Task ReplaceAllAsync(List<ProductSimilarity> similarities, CancellationToken cancellationToken = default)
    {
        _dbContext.ProductSimilarities.RemoveRange(_dbContext.ProductSimilarities);
        await _dbContext.SaveChangesAsync(cancellationToken);

        if (similarities.Count == 0) return;

        await _dbContext.ProductSimilarities.AddRangeAsync(similarities, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}