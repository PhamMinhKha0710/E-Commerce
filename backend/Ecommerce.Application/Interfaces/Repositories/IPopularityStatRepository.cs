using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;
public interface IPopularityStatRepository
{
    Task<List<Product>> GetPopularProductsAsync(int? categoryId, int limit);
}