using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ShopOrder> GetOrderByIdAsync(int orderId)
        {
            return await _context.ShopOrders
                .Include(o => o.OrderLines)
                    .ThenInclude(ol => ol.ProductItem)
                        .ThenInclude(pi => pi.Product)
                            .ThenInclude(p => p.ProductImages)
                .Include(o => o.Payments)
                .Include(o => o.OrderStatusHistories)
                    .ThenInclude(h => h.OrderStatus)
                .Include(o => o.ShippingAddress)
                .Include(o => o.ShippingMethod)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public IQueryable<ShopOrder> GetOrdersQueryable()
        {
            return _context.ShopOrders.AsQueryable();
        }

        public async Task<UserAddress> GetDefaultAddressAsync(int? userId)
        {
            return await _context.userAddresses
                .Include(ua => ua.Address)
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.IsDefault);
        }

        public async Task<ShippingMethod> GetShippingMethodByIdAsync(int shippingMethodId)
        {
            return await _context.ShippingMethods
                .FirstOrDefaultAsync(sm => sm.Id == shippingMethodId);
        }

        public async Task<PaymentMethod> GetPaymentMethodByNameAsync(string name)
        {
            return await _context.paymentMethods
                .FirstOrDefaultAsync(pm => pm.Name == name && pm.IsActive);
        }

        public async Task<OrderStatus> GetOrderStatusByNameAsync(string name)
        {
            return await _context.OrderStatuses
                .FirstOrDefaultAsync(os => os.Status == name);
        }

        public async Task<ProductItem> GetProductItemByIdAsync(int productItemId)
        {
            return await _context.ProductItems
                .FirstOrDefaultAsync(pi => pi.Id == productItemId);
        }

        public async Task<ProductItem> GetDefaultProductItemByProductIdAsync(int productId)
        {
            return await _context.ProductItems
                .FirstOrDefaultAsync(pi => pi.ProductId == productId && pi.IsDefault);
        }

        public async Task<ShoppingCartItem> GetCartItemByProductItemIdAsync(int userId, int productItemId)
        {
            return await _context.ShoppingCartItems
                .Include(sci => sci.ShoppingCart)
                .FirstOrDefaultAsync(sci => sci.ShoppingCart.UserId == userId && sci.ProductItemId == productItemId);
        }

        public async Task CreateOrderAsync(ShopOrder order)
        {
            await _context.ShopOrders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateOrderAsync(ShopOrder order)
        {
            _context.ShopOrders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProductItemAsync(ProductItem productItem)
        {
            _context.ProductItems.Update(productItem);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCartItemAsync(ShoppingCartItem cartItem)
        {
            _context.ShoppingCartItems.Update(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCartItemAsync(ShoppingCartItem cartItem)
        {
            _context.ShoppingCartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var result = await action();
                    await transaction.CommitAsync();
                    return result;
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task<string> GetUserEmailByShopOrderIdAsync(int shopOrderId)
        {
            var order = await _context.ShopOrders
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == shopOrderId);

            if (order == null)
            {
                throw new Exception($"Order with Id {shopOrderId} not found.");
            }

            if (order.User == null)
            {
                throw new Exception($"User not found for order with ID {shopOrderId}.");
            }

            return order.User.Email;
        }

        public async Task DeleteOrderAsync(ShopOrder order)
        {
            _context.ShopOrders.Remove(order);
            await _context.SaveChangesAsync();
        }

        public async Task AddOrderStatusAsync(OrderStatus status)
        {
            _context.OrderStatuses.Add(status);
            await _context.SaveChangesAsync();
        }
        public async Task<Promotion> GetPromotionByCodeAsync(string code)
        {
            return await _context.Promotions
                .Include(p => p.PromotionCategories)
                .FirstOrDefaultAsync(p => p.Code == code && p.IsActive && p.StartDate <= DateTime.UtcNow && p.EndDate >= DateTime.UtcNow);
        }

        public async Task<bool> IsProductInPromotionCategoryAsync(int productId, int promotionId)
        {
            return await _context.Products
                .Where(p => p.Id == productId)
                .Join(_context.PromotionCategories,
                    p => p.ProductCategoryId,
                    pc => pc.ProductCategoryId,
                    (p, pc) => pc)
                .AnyAsync(pc => pc.PromotionId == promotionId);
        }

        public async Task UpdatePromotionAsync(Promotion promotion)
        {
            _context.Promotions.Update(promotion);
            await _context.SaveChangesAsync();
        }
    }
}