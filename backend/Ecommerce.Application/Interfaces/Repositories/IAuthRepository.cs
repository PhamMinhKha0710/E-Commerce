using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces;

public interface IAuthRepository
{
    Task<User> RegisterAsync(User user);
    Task<User> FindByEmailAsync(string email);
    Task<User> FindByIdAsync(int id);
    Task<User?> FindByRoleAsync(string role);
    Task AddRefreshTokenAsync(RefreshToken token);
    Task<RefreshToken> FindRefreshTokenAsync(string token);
    Task UpdateUserAsync(User user);
    Task UpdateRefreshTokenAsync(RefreshToken token);
    Task DeleteAsync(int userId);
    Task AddUserAsync(User user);
    Task<RefreshToken> GetRefreshTokenByUserIdAsync(int userId);
}