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
}