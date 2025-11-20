using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IWishlistRepository
{
    Task<List<WishlistItem>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<WishlistItem?> GetItemAsync(int userId, int productId, CancellationToken cancellationToken = default);
    Task AddAsync(WishlistItem wishlistItem, CancellationToken cancellationToken = default);
    Task RemoveAsync(WishlistItem wishlistItem, CancellationToken cancellationToken = default);
}


