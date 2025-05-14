using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;
public class UserViewHistoryRepository : IUserViewHistoryRepository
{
    private readonly AppDbContext _dbContext;

    public UserViewHistoryRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<int>> GetViewedProductIdsAsync(int userId)
    {
        return await _dbContext.UserViewHistories
            .Where(uvh => uvh.UserId == userId)
            .Select(uvh => uvh.ProductId)
            .ToListAsync();
    }

    public async Task<List<int>> GetDistinctProductIdsAsync()
    {
        return await _dbContext.UserViewHistories
            .Select(uvh => uvh.ProductId)
            .Distinct()
            .ToListAsync();
    }

    public async Task<int> GetCountAsync()
    {
        return await _dbContext.UserViewHistories.CountAsync();
    }
}