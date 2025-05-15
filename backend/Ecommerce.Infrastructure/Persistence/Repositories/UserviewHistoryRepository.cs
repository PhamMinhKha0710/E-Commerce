using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
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

    public async Task<UserViewHistory> GetOldestViewAsync(int userId)
    {
        return await _dbContext.UserViewHistories
               .Where(uvh => uvh.UserId == userId)
               .OrderBy(uvh => uvh.ViewTime)
               .FirstOrDefaultAsync();
    } 

    public async Task AddAsync(UserViewHistory viewHistory)
    {
        var existingViewHistory = await _dbContext.UserViewHistories
                .FirstOrDefaultAsync(p => p.UserId == viewHistory.UserId && p.ProductId == viewHistory.ProductId);
        if (existingViewHistory != null)
        {
            // Cập nhật ViewTime nếu bản ghi đã tồn tại
            existingViewHistory.ViewTime = viewHistory.ViewTime; 
            _dbContext.UserViewHistories.Update(existingViewHistory);
        }
        else
            await _dbContext.UserViewHistories.AddAsync(viewHistory);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var viewHistory = await _dbContext.UserViewHistories.FindAsync(id);
        if (viewHistory != null)
        {
            _dbContext.UserViewHistories.Remove(viewHistory);
            await _dbContext.SaveChangesAsync();
        }
    }
    public async Task CleanOldViewsAsync(TimeSpan age)
    {
        var cutoffDate = DateTime.UtcNow - age;
        var oldViews = await _dbContext.UserViewHistories
            .Where(uvh => uvh.ViewTime < cutoffDate)
            .ToListAsync();
        _dbContext.UserViewHistories.RemoveRange(oldViews);
        await _dbContext.SaveChangesAsync();
    }
}