using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;
public interface IUserViewHistoryRepository
{
    Task<List<int>> GetViewedProductIdsAsync(int userId);
    Task<List<int>> GetDistinctProductIdsAsync();
    Task<int> GetCountAsync();
    Task<UserViewHistory> GetOldestViewAsync(int userId);
    Task AddAsync(UserViewHistory viewHistory);
    Task DeleteAsync(int id);
}