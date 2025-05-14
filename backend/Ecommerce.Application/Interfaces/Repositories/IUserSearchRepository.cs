namespace Ecommerce.Application.Interfaces.Repositories;
public interface IUserSearchRepository
{
    Task<string> GetRecentSearchKeywordAsync(int userId);
}