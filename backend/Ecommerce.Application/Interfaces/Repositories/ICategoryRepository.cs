using Ecommerce.Domain.Entities;
namespace Ecommerce.Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<List<ProductCategory>> GetAllCategoriesAsync(); // lấy full cha
    Task<List<ProductCategory>> GetSubcategoriesByCategoryIdAsync(int parentId);
    Task<List<ProductCategory>> GetAllAsync();
    Task<ProductCategory> GetByIdAsync(int id);
} 