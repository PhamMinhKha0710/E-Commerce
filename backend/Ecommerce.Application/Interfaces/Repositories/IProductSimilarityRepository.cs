using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;
public interface IProductSimilarityRepository
{
    Task<List<Product>> GetSimilarProductsAsync(List<int> productIds, int limit);
    Task AddRangeAsync(List<ProductSimilarity> similarities);
}