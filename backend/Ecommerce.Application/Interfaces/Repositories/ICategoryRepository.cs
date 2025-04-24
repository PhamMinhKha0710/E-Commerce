using Ecommerce.Domain.Entities;
namespace Ecommerce.Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<List<ProductCategory>> GetAllCategoriesAsync();
} 