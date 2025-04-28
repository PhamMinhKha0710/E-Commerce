using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Infrastructure.Persistence.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly IProductRepository _productRepository;
        private readonly ILogger<CartRepository> _logger;

        public CartRepository(
            AppDbContext dbContext,
            IProductRepository productRepository,
            ILogger<CartRepository> logger)
        {
            _dbContext = dbContext;
            _productRepository = productRepository;
            _logger = logger;
        }

        // Lớp nội bộ chỉ sử dụng trong repository
        private class InternalCartItemDto
        {
            public int Id { get; set; }
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public string ImageUrl { get; set; }
            public decimal Price { get; set; }
            public int Quantity { get; set; }
            public string Currency { get; set; }
            public bool HasVariations { get; set; }
            public int? ProductItemId { get; set; } // Thay SelectedVariations
            public bool InStock { get; set; }

            // Chuyển đổi từ InternalCartItemDto sang CartItemDto
            public CartItemDto ToCartItemDto()
            {
                return new CartItemDto
                {
                    ProductId = this.ProductId,
                    ProductName = this.ProductName,
                    ImageUrl = this.ImageUrl,
                    Price = this.Price,
                    Quantity = this.Quantity,
                    Currency = this.Currency,
                    HasVariations = this.HasVariations,
                    ProductItemId = this.ProductItemId // Trả về ProductItemId
                };
            }

            // Tạo InternalCartItemDto từ CartItemDto
            public static InternalCartItemDto FromCartItemDto(CartItemDto dto)
            {
                return new InternalCartItemDto
                {
                    ProductId = dto.ProductId,
                    ProductName = dto.ProductName,
                    ImageUrl = dto.ImageUrl,
                    Price = dto.Price,
                    Quantity = dto.Quantity,
                    Currency = dto.Currency,
                    HasVariations = dto.HasVariations,
                    ProductItemId = dto.ProductItemId // Lấy trực tiếp ProductItemId
                };
            }
        }

        public async Task<CartDto> GetCartByUserIdAsync(int userId)
        {
            try
            {
                var user = await _dbContext.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning($"User with ID {userId} not found");
                    return CreateEmptyCart(userId);
                }

                var cart = await GetOrCreateCartAsync(userId);

                if (cart != null)
                {
                    if (cart.ShoppingCartItems != null && 
                        cart.ShoppingCartItems.Any() && 
                        cart.ShoppingCartItems.First().ProductItem == null)
                    {
                        cart = await _dbContext.ShoppingCarts
                            .Include(c => c.ShoppingCartItems)
                                .ThenInclude(ci => ci.ProductItem)
                                    .ThenInclude(pi => pi.Product)
                                        .ThenInclude(p => p.ProductImages)
                            .FirstOrDefaultAsync(c => c.Id == cart.Id);
                    }

                    var cartDto = await MapCartToDto(cart);
                    _logger.LogInformation($"Retrieved cart for user {userId} with {cartDto.CartItem.Count} items");
                    return cartDto;
                }
                else
                {
                    _logger.LogError($"Failed to get or create cart for user {userId}");
                    return CreateEmptyCart(userId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving cart for user {userId}");
                return CreateEmptyCart(userId);
            }
        }

        public async Task<CartDto> AddItemToCartAsync(int userId, CartItemDto item)
        {
            try
            {
                var internalItem = InternalCartItemDto.FromCartItemDto(item);
                var cart = await GetOrCreateCartAsync(userId);

                var product = await _productRepository.GetProductByIdAsync(internalItem.ProductId);
                if (product == null)
                {
                    throw new Exception($"Product with ID {internalItem.ProductId} not found");
                }

                ProductItem productItem = null;

                if (internalItem.HasVariations && internalItem.ProductItemId.HasValue)
                {
                    productItem = await _productRepository.GetProductItemByIdAsync(internalItem.ProductItemId.Value);
                    if (productItem == null || productItem.ProductId != internalItem.ProductId)
                    {
                        throw new Exception($"ProductItem {internalItem.ProductItemId} not found or does not belong to product {internalItem.ProductId}");
                    }
                }
                else
                {
                    var productItems = await _productRepository.GetProductItemsByProductIdAsync(internalItem.ProductId);
                    productItem = productItems.FirstOrDefault(pi => pi.IsDefault) ?? productItems.FirstOrDefault();
                    if (productItem == null)
                    {
                        throw new Exception($"No product items found for product {internalItem.ProductId}");
                    }
                    internalItem.ProductItemId = productItem.Id;
                }

                var existingItem = cart.ShoppingCartItems?.FirstOrDefault(ci => ci.ProductItemId == productItem.Id);

                if (existingItem != null)
                {
                    existingItem.Qty += internalItem.Quantity;
                    _dbContext.Update(existingItem);
                }
                else
                {
                    var cartItem = new ShoppingCartItem
                    {
                        ShoppingCartId = cart.Id,
                        ProductItemId = productItem.Id,
                        Qty = internalItem.Quantity
                    };
                    _dbContext.ShoppingCartItems.Add(cartItem);
                }

                await _dbContext.SaveChangesAsync();
                _logger.LogInformation($"Added/updated item in cart for user {userId}, product {internalItem.ProductId}");
                return await GetCartByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding item to cart for user {userId}");
                throw;
            }
        }

        public async Task<CartDto> UpdateCartItemAsync(int userId, int cartItemId, int quantity, List<VariationSelectionDto> selectedVariations)
        {
            try
            {
                var cart = await _dbContext.ShoppingCarts
                    .Include(c => c.ShoppingCartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    throw new Exception($"Cart not found for user {userId}");
                }

                var cartItem = cart.ShoppingCartItems?.FirstOrDefault(ci => ci.Id == cartItemId);

                if (cartItem == null)
                {
                    throw new Exception($"Cart item with ID {cartItemId} not found in user's cart");
                }

                cartItem.Qty = quantity;
                _dbContext.Update(cartItem);

                await _dbContext.SaveChangesAsync();
                _logger.LogInformation($"Updated cart item {cartItemId} for user {userId}");
                return await GetCartByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating cart item {cartItemId} for user {userId}");
                throw;
            }
        }

        public async Task<CartDto> RemoveCartItemAsync(int userId, int cartItemId)
        {
            try
            {
                var cart = await _dbContext.ShoppingCarts
                    .Include(c => c.ShoppingCartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || cart.ShoppingCartItems == null)
                {
                    _logger.LogWarning($"Cart not found for user {userId} when removing item");
                    return CreateEmptyCart(userId);
                }

                var cartItem = cart.ShoppingCartItems.FirstOrDefault(ci => ci.Id == cartItemId);

                if (cartItem == null)
                {
                    _logger.LogWarning($"Cart item with ID {cartItemId} not found in user's cart");
                    return await GetCartByUserIdAsync(userId);
                }

                _dbContext.ShoppingCartItems.Remove(cartItem);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation($"Removed cart item {cartItemId} from user {userId}'s cart");
                return await GetCartByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing cart item {cartItemId} for user {userId}");
                throw;
            }
        }

        public async Task<CartDto> ClearCartAsync(int userId)
        {
            try
            {
                var cart = await _dbContext.ShoppingCarts
                    .Include(c => c.ShoppingCartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || cart.ShoppingCartItems == null || !cart.ShoppingCartItems.Any())
                {
                    _logger.LogInformation($"No cart or empty cart for user {userId}, nothing to clear");
                    return CreateEmptyCart(userId);
                }

                _dbContext.ShoppingCartItems.RemoveRange(cart.ShoppingCartItems);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation($"Cleared all items from user {userId}'s cart");
                return await GetCartByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error clearing cart for user {userId}");
                throw;
            }
        }

        public async Task<CartDto> SyncCartAsync(int userId, List<CartItemDto> localCartItems)
        {
            try
            {
                _logger.LogInformation($"Syncing {localCartItems.Count} items from local storage to database for user {userId}");
                
                var internalItems = localCartItems.Select(item => InternalCartItemDto.FromCartItemDto(item)).ToList();
                var cart = await GetOrCreateCartAsync(userId);

                if (cart.ShoppingCartItems == null)
                {
                    cart.ShoppingCartItems = new List<ShoppingCartItem>();
                }

                foreach (var localItem in internalItems)
                {
                    try
                    {
                        var product = await _productRepository.GetProductByIdAsync(localItem.ProductId);
                        if (product == null)
                        {
                            _logger.LogWarning($"Product {localItem.ProductId} not found when syncing cart, skipping item");
                            continue;
                        }

                        ProductItem productItem = null;
                        int? productItemId = localItem.ProductItemId;

                        if (localItem.HasVariations && localItem.ProductItemId.HasValue)
                        {
                            productItem = await _productRepository.GetProductItemByIdAsync(localItem.ProductItemId.Value);
                            if (productItem == null || productItem.ProductId != localItem.ProductId)
                            {
                                _logger.LogWarning($"ProductItem {localItem.ProductItemId} not found or does not belong to product {localItem.ProductId}, skipping item");
                                continue;
                            }
                        }
                        else
                        {
                            var productItems = await _productRepository.GetProductItemsByProductIdAsync(localItem.ProductId);
                            productItem = productItems.FirstOrDefault(pi => pi.IsDefault) ?? productItems.FirstOrDefault();
                            if (productItem == null)
                            {
                                _logger.LogWarning($"No product items found for product {localItem.ProductId}, skipping item");
                                continue;
                            }
                            productItemId = productItem.Id;
                        }

                        var existingItem = cart.ShoppingCartItems.FirstOrDefault(ci => ci.ProductItemId == productItemId);

                        if (existingItem != null)
                        {
                            existingItem.Qty = localItem.Quantity;
                            _dbContext.Update(existingItem);
                        }
                        else
                        {
                            var cartItem = new ShoppingCartItem
                            {
                                ShoppingCartId = cart.Id,
                                ProductItemId = productItemId.Value,
                                Qty = localItem.Quantity
                            };
                            _dbContext.ShoppingCartItems.Add(cartItem);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error processing item {localItem.ProductId} during cart sync, skipping");
                        continue;
                    }
                }

                await _dbContext.SaveChangesAsync();
                return await GetCartByUserIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error syncing cart for user {userId}");
                throw;
            }
        }

        public async Task<CartDto> FinalizeCartAsync(int userId, List<CartItemDto> localCartItems)
        {
            try
            {
                _logger.LogInformation($"Finalizing cart for user {userId} with {localCartItems.Count} items");
                await ClearCartAsync(userId);
                return await SyncCartAsync(userId, localCartItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error finalizing cart for user {userId}");
                throw;
            }
        }

        #region Helper Methods

        private async Task<ShoppingCart> GetOrCreateCartAsync(int userId)
        {
            var cart = await _dbContext.ShoppingCarts
                .Include(c => c.ShoppingCartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    throw new Exception($"User with ID {userId} not found");
                }

                cart = new ShoppingCart
                {
                    UserId = userId,
                    ShoppingCartItems = new List<ShoppingCartItem>()
                };
                _dbContext.ShoppingCarts.Add(cart);
                await _dbContext.SaveChangesAsync();

                cart = await _dbContext.ShoppingCarts
                    .Include(c => c.ShoppingCartItems)
                    .FirstAsync(c => c.Id == cart.Id);
            }

            return cart;
        }

        private CartDto CreateEmptyCart(int userId, string userName = "Anonymous")
        {
            return new CartDto
            {
                CartItem = new List<CartItemDto>(),
            };
        }

        private async Task<CartDto> MapCartToDto(ShoppingCart cart)
        {
            var items = new List<CartItemDto>();

            if (cart.ShoppingCartItems != null && cart.ShoppingCartItems.Any())
            {
                foreach (var item in cart.ShoppingCartItems)
                {
                    var productItem = item.ProductItem;
                    if (productItem == null)
                    {
                        _logger.LogWarning($"Product item {item.ProductItemId} not found for cart item {item.Id}, skipping");
                        continue;
                    }

                    var product = productItem.Product;
                    if (product == null)
                    {
                        _logger.LogWarning($"Product not found for product item {productItem.Id}, skipping");
                        continue;
                    }

                    decimal price = productItem.Price;
                    string imageUrl = productItem.ImageUrl;

                    if (product.ProductImages != null && product.ProductImages.Any())
                    {
                        imageUrl = product.ProductImages.First().ImageUrl;
                    }

                    var cartItem = new CartItemDto
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        ImageUrl = imageUrl,
                        Price = price,
                        Quantity = item.Qty,
                        Currency = product.Currency,
                        HasVariations = product.HasVariation,
                        ProductItemId = product.HasVariation ? productItem.Id : null // Sửa ở đây để ProductItemId = null khi HasVariations = false
                    };

                    items.Add(cartItem);
                }
            }

            var userName = "Anonymous";
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == cart.UserId);
            if (user != null)
            {
                userName = $"{user.FirstName} {user.LastName}".Trim();
            }

            return new CartDto
            {
                CartItem = items
            };
        }

        #endregion
    }
}