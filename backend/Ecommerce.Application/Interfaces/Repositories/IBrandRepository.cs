using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IBrandRepository
{
    Task<List<Brand>> GetAllBrandsAsync();
    Task<Brand> GetBrandByIdAsync(int id);
    Task<Brand> GetByIdAsync(int id);
    Task<Brand> AddBrandAsync(Brand brand);
    Task<Brand> UpdateBrandAsync(Brand brand);
    Task<bool> DeleteBrandAsync(int id);
    Task<bool> BrandExistsAsync(string name);
    Task<int> GetTotalBrandsCountAsync();
} 