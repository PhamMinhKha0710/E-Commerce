using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task<List<Product>> GetAllWithBasicInfoAsync(CancellationToken cancellationToken = default);
    IQueryable<Product> Query();
    Task<Product> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Product entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(Product entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(Product entity, CancellationToken cancellationToken = default);
    Task<ProductItem> GetProductItemByIdAsync(int productItemId);
    Task<List<ProductItem>> GetProductItemsByProductIdAsync(int productId);
    Task<Product> GetProductByIdAsync(int id);
    Task<List<Product>> GetByCategoryIdAsync(int categoryId, int limit);
    Task<Product> GetByIdAsync(int id);
    Task<List<Product>> GetTopByPriceAsync(int? categoryId, int limit);
    Task<List<int>> GetRelatedCategoriesAsync(int categoryId);
    Task<List<Product>> GetRandomProductsAsync(int count);

    Task<Product> GetProductDetailByIdAsync(int id, CancellationToken cancellationToken);
    Task<List<ProductItem>> GetProductVariantsAsync(int productId, CancellationToken cancellationToken);
    Task<(List<Product> Products, int TotalCount)> GetPaginatedProductsAsync(
        int pageNumber,
        int pageSize,
        string? sortBy = null,
        int? categoryId = null,
        int? brandId = null,
        string? status = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        CancellationToken cancellationToken = default);
    Task<(List<string> Categories, List<string> Brands)> GetProductFilterOptionsAsync(CancellationToken cancellationToken);
    Task<(List<(int Id, string Name)> Categories, List<(int Id, string Name)> Brands)> GetProductFilterOptionsWithIdsAsync(CancellationToken cancellationToken);
    Task<ProductItem> GetProductVariantByIdAsync(int productId, int variantId, CancellationToken cancellationToken);
    Task<List<Product>> GetByCategoryIdAsync(int categoryId, int limit, CancellationToken cancellationToken = default);
    Task<List<Product>> GetRandomProductsAsync(int count, CancellationToken cancellationToken = default);
    // Additional methods for product items and images
    Task AddProductItemAsync(ProductItem productItem, CancellationToken cancellationToken = default);
    Task UpdateProductItemAsync(ProductItem productItem, CancellationToken cancellationToken = default);
    Task DeleteProductItemAsync(ProductItem productItem, CancellationToken cancellationToken = default);
    
    Task AddProductImageAsync(ProductImage productImage, CancellationToken cancellationToken = default);
    Task DeleteProductImageAsync(ProductImage productImage, CancellationToken cancellationToken = default);
    Task<List<ProductImage>> GetProductImagesByProductIdAsync(int productId, CancellationToken cancellationToken = default);
}