 // Ecommerce.Infrastructure/Repositories/UserSearchRepository.cs
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories;
public class UserSearchRepository : IUserSearchRepository
{
    private readonly AppDbContext _dbContext;

    public UserSearchRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<string> GetRecentSearchKeywordAsync(int userId)
    {
        return await _dbContext.UserSearches
            .Where(us => us.UserId == userId)
            .OrderByDescending(us => us.SearchTime)
            .Select(us => us.keyWord)
            .FirstOrDefaultAsync();
    }
}