using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;
public interface IProductSimilarityRepository
{
    Task<List<Product>> GetSimilarProductsAsync(List<int> productIds, int limit);
    Task AddRangeAsync(List<ProductSimilarity> similarities);
    Task ReplaceAllAsync(List<ProductSimilarity> similarities, CancellationToken cancellationToken = default);
}