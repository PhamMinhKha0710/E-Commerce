using Ecommerce.Application.Common.DTOs;


namespace Ecommerce.Application.Interfaces.Repositories
{
    public interface ICartRepository
    {
        /// <summary>
        /// Gets a user's cart by user ID
        /// </summary>
        Task<CartDto> GetCartByUserIdAsync(int userId);
        
        /// <summary>
        /// Adds an item to a user's cart
        /// </summary>
        Task<CartDto> AddItemToCartAsync(int userId, CartItemDto item);
        
        /// <summary>
        /// Updates a cart item (quantity or variations)
        /// </summary>
        Task<CartDto> UpdateCartItemAsync(int userId, int cartItemId, int quantity, List<VariationSelectionDto> selectedVariations);
        
        /// <summary>
        /// Removes an item from a user's cart
        /// </summary>
        Task<CartDto> RemoveCartItemAsync(int userId, int cartItemId);
        
        /// <summary>
        /// Clears all items from a user's cart
        /// </summary>
        Task<CartDto> ClearCartAsync(int userId);
        
        /// <summary>
        /// Syncs local cart items with the database after login
        /// </summary>
        Task<CartDto> SyncCartAsync(int userId, List<CartItemDto> localCartItems);
        
        /// <summary>
        /// Finalizes the cart before checkout
        /// </summary>
        Task<CartDto> FinalizeCartAsync(int userId, List<CartItemDto> localCartItems);
    }
} 