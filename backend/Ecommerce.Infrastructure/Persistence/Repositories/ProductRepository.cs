using Microsoft.EntityFrameworkCore;
using Ecommerce.Infrastructure.Persistence.Data;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _dbContext;

    public ProductRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _dbContext.Products.ToListAsync();
    }
    public IQueryable<Product> Query()
    {
        return _dbContext.Products.AsQueryable();
    }

    public async Task<Product> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Products.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task AddAsync(Product entity, CancellationToken cancellationToken = default)
    {
        await _dbContext.Products.AddAsync(entity, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Product entity, CancellationToken cancellationToken = default)
    {
        _dbContext.Products.Update(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Product entity, CancellationToken cancellationToken = default)
    {
        _dbContext.Products.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
    public async Task<ProductItem> GetProductItemByIdAsync(int productItemId)
    {
        return await _dbContext.ProductItems
            .AsSplitQuery()
            .Include(pi => pi.ProductConfigurations)
                .ThenInclude(pc => pc.VariationOption)
                    .ThenInclude(vo => vo.Variation)
            .FirstOrDefaultAsync(pi => pi.Id == productItemId);
    }

    public async Task<List<ProductItem>> GetProductItemsByProductIdAsync(int productId)
    {
        return await _dbContext.ProductItems
            .AsSplitQuery()
            .Where(pi => pi.ProductId == productId)
            .Include(pi => pi.ProductConfigurations)
                .ThenInclude(pc => pc.VariationOption)
                    .ThenInclude(vo => vo.Variation)
            .ToListAsync();
    }

    public async Task<Product> GetProductByIdAsync(int id)
    {
        // Use AsSplitQuery to optimize large object graphs with multiple includes
        // This splits the query into multiple SQL queries, one per included relationship
        return await _dbContext.Products
            .AsSplitQuery()
            .Include(p => p.Brand)
            .Include(p => p.ProductCategory)
            .Include(p => p.ProductImages)
            // Include ProductItems only
            .Include(p => p.ProductItems)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Product>> GetByCategoryIdAsync(int categoryId, int limit)
    {
        return await _dbContext.Products
            .Where(p => p.ProductCategoryId == categoryId)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Product> GetByIdAsync(int id)
    {
        return await _dbContext.Products
            .Include(p => p.ProductItems.Where(pi => pi.IsDefault))
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Product>> GetTopByPriceAsync(int? categoryId, int limit)
    {
        var query = _dbContext.Products
            .Include(p => p.ProductItems.Where(pi => pi.IsDefault))
            .Where(p => categoryId == null || p.ProductCategoryId == categoryId);

        return await query
            .OrderByDescending(p => p.ProductItems.FirstOrDefault().Price)
            .Take(limit)
            .ToListAsync();
    }
}