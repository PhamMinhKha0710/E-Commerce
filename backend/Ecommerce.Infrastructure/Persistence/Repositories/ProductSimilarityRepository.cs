// Ecommerce.Infrastructure/Repositories/ProductSimilarityRepository.cs
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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
        return await _dbContext.ProductSimilarities
            .Where(ps => productIds.Contains(ps.ProductId1))
            .OrderByDescending(ps => ps.Similarity)
            .Take(limit)
            .Select(ps => ps.Product2)
            .ToListAsync();
    }

    public async Task AddRangeAsync(List<ProductSimilarity> similarities)
    {
        await _dbContext.ProductSimilarities.AddRangeAsync(similarities);
        await _dbContext.SaveChangesAsync();
    }
}