using Ecommerce.Domain.Entitie;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence.Data.Configurations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Ecommerce.Infrastructure.Persistence;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet cho các thực thể
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<OrderLine> OrderLines { get; set; }
    public DbSet<OrderStatus> OrderStatuses { get; set; }
    public DbSet<OrderStatusHistory> orderStatusHistories {get; set;}
    public DbSet<Payment> payments {get; set;}
    public DbSet<PaymentMethod> paymentMethods {get; set;}
    public DbSet<PaymentLog> paymentLogs {get; set;}
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductSimilarity> ProductSimilarities { get; set; }
    public DbSet<ProductCategory> ProductCategories { get; set; }
    public DbSet<Domain.Entities.ProductConfiguration> ProductConfigurations { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductItem> ProductItems { get; set; }
    public DbSet<Promotion> Promotions { get; set; }
    public DbSet<PromotionCategory> PromotionCategories { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<ShopOrder> ShopOrders { get; set; }
    public DbSet<ShoppingCart> ShoppingCarts { get; set; }
    public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }
    public DbSet<ShippingMethod> ShippingMethods { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserAddress> userAddresses {get; set;}
    public DbSet<UserReview> UserReviews { get; set; }
    public DbSet<Variation> Variations { get; set; }
    public DbSet<VariationOption> VariationOptions { get; set; }
    public DbSet<UserSearch> UserSearches {get; set;}
    public DbSet<UserViewHistory> UserViewHistories {get; set;}
    public DbSet<PopularityStat> PopularityStats {get; set;}
    public DbSet<BlogPost> BlogPosts {get; set;}
    public DbSet<BlogComment> BlogComments {get; set;}
    public DbSet<BlogCategory> BlogCategories {get; set;}
    public DbSet<WishlistItem> WishlistItems { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Áp dụng các configuration 
        modelBuilder.ApplyConfiguration(new AddressConfiguration());
        modelBuilder.ApplyConfiguration(new BrandConfiguration());
        modelBuilder.ApplyConfiguration(new OrderLineConfiguration());
        modelBuilder.ApplyConfiguration(new OrderStatusConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentMethodConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentLogConfiguration());
        modelBuilder.ApplyConfiguration(new Data.Configurations.ProductConfiguration());
        modelBuilder.ApplyConfiguration(new PopularityStatConfiguration());
        modelBuilder.ApplyConfiguration(new ProductSimilarityConfiguration());
        modelBuilder.ApplyConfiguration(new ProductCategoryConfiguration());
        modelBuilder.ApplyConfiguration(new ProductConfigurationConfiguration());
        modelBuilder.ApplyConfiguration(new ProductImageConfiguration());
        modelBuilder.ApplyConfiguration(new ProductItemConfiguration());
        modelBuilder.ApplyConfiguration(new PromotionConfiguration());
        modelBuilder.ApplyConfiguration(new PromotionCategoryConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
        modelBuilder.ApplyConfiguration(new ShopOrderConfiguration());
        modelBuilder.ApplyConfiguration(new ShoppingCartConfiguration());
        modelBuilder.ApplyConfiguration(new ShoppingCartItemConfiguration());
        modelBuilder.ApplyConfiguration(new ShippingMethodConfiguration());
        modelBuilder.ApplyConfiguration(new UserAddressConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new UserReviewConfiguration());
        modelBuilder.ApplyConfiguration(new UserSearchConfiguration());
        modelBuilder.ApplyConfiguration(new UserViewHistoryConfiguration());
        modelBuilder.ApplyConfiguration(new VariationConfiguration());
        modelBuilder.ApplyConfiguration(new VariationOptionConfiguration());
        modelBuilder.ApplyConfiguration(new BlogPostConfiguration());
        modelBuilder.ApplyConfiguration(new BlogCommentConfiguration());
        modelBuilder.ApplyConfiguration(new BlogCategoryConfiguration());
        modelBuilder.ApplyConfiguration(new WishlistItemConfiguration());
    }
}