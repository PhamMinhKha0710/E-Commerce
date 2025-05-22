using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Persistence.Repositories;

public class BrandRepository : IBrandRepository
{
    private readonly AppDbContext _context;

    public BrandRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Brand>> GetAllBrandsAsync()
    {
        return await _context.Brands
            .Include(b => b.Products)
            .ToListAsync();
    }

    public async Task<Brand> GetBrandByIdAsync(int id)
    {
        return await _context.Brands
            .Include(b => b.Products)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Brand> GetByIdAsync(int id)
    {
        return await _context.Brands
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Brand> AddBrandAsync(Brand brand)
    {
        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();
        return brand;
    }

    public async Task<Brand> UpdateBrandAsync(Brand brand)
    {
        _context.Brands.Update(brand);
        await _context.SaveChangesAsync();
        return brand;
    }

    public async Task<bool> DeleteBrandAsync(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
        {
            return false;
        }

        _context.Brands.Remove(brand);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BrandExistsAsync(string name)
    {
        return await _context.Brands.AnyAsync(b => b.Name == name);
    }

    public async Task<int> GetTotalBrandsCountAsync()
    {
        return await _context.Brands.CountAsync();
    }
} 