using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories
{
    public interface IOrderRepository
    {
        Task<ShopOrder> GetOrderByIdAsync(int orderId);
        IQueryable<ShopOrder> GetOrdersQueryable();
        Task<UserAddress> GetDefaultAddressAsync(int? userId);
        Task<ShippingMethod> GetShippingMethodByIdAsync(int shippingMethodId);
        Task<PaymentMethod> GetPaymentMethodByNameAsync(string name);
        Task<OrderStatus> GetOrderStatusByNameAsync(string name);
        Task<ProductItem> GetProductItemByIdAsync(int productItemId);
        Task<ProductItem> GetDefaultProductItemByProductIdAsync(int productId);
        Task<ShoppingCartItem> GetCartItemByProductItemIdAsync(int userId, int productItemId);
        Task CreateOrderAsync(ShopOrder order);
        Task UpdateOrderAsync(ShopOrder order);
        Task UpdateProductItemAsync(ProductItem productItem);
        Task UpdateCartItemAsync(ShoppingCartItem cartItem);
        Task DeleteCartItemAsync(ShoppingCartItem cartItem);
        Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action);
        Task<string> GetUserEmailByShopOrderIdAsync(int shopOrderId);
        Task DeleteOrderAsync(ShopOrder order);
        Task AddOrderStatusAsync(OrderStatus status);

        // Phương thức cho khuyến mãi khi order
        Task<Promotion> GetPromotionByCodeAsync(string code);
        Task<bool> IsProductInPromotionCategoryAsync(int productId, int promotionId);
        Task UpdatePromotionAsync(Promotion promotion);
    }
}