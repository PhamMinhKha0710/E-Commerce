using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces;

public interface IProductItemRepository 
{
    Task<Product> GetProductWithDefaultItemAsync(int productId, CancellationToken cancellationToken = default);
    Task UpdateElasticsearchIdAsync(int productId, string elasticsearchId, CancellationToken cancellationToken = default);
}