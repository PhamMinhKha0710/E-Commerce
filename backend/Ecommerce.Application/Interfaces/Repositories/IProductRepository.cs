using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    IQueryable<Product> Query();
    Task<Product> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Product entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(Product entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(Product entity, CancellationToken cancellationToken = default);
    Task<ProductItem> GetProductItemByIdAsync(int productItemId);
    Task<List<ProductItem>> GetProductItemsByProductIdAsync(int productId);
    Task<Product> GetProductByIdAsync(int id);
}