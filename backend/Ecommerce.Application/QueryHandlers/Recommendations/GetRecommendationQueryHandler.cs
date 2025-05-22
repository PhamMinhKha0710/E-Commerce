using Ecommerce.Domain.Entities;
using MediatR;
using System.Text.Json;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Services;

namespace Ecommerce.Application.QueryHandlers.Recommendations;
public class GetRecommendationsQueryHandler : IRequestHandler<GetRecommendationsQuery, List<ProductRecommendationDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IPopularityStatRepository _popularityStatRepository;
    private readonly IUserViewHistoryRepository _userViewHistoryRepository;
    private readonly IUserSearchRepository _userSearchRepository;
    private readonly IProductSimilarityRepository _productSimilarityRepository;
    private readonly IRedisService _redisService;
    private readonly ICurrentUserService _currentUserService;

    public GetRecommendationsQueryHandler(
        IProductRepository productRepository,
        IPopularityStatRepository popularityStatRepository,
        IUserViewHistoryRepository userViewHistoryRepository,
        IUserSearchRepository userSearchRepository,
        IProductSimilarityRepository productSimilarityRepository,
        IRedisService redisService,
        ICurrentUserService currentUserService)
    {
        _productRepository = productRepository;
        _popularityStatRepository = popularityStatRepository;
        _userViewHistoryRepository = userViewHistoryRepository;
        _userSearchRepository = userSearchRepository;
        _productSimilarityRepository = productSimilarityRepository;
        _redisService = redisService;
        _currentUserService = currentUserService;
    }

    public async Task<List<ProductRecommendationDto>> Handle(GetRecommendationsQuery request, CancellationToken cancellationToken)
    {
        const int MINIMUM_PRODUCTS = 7;
        var userId = request.UserId ?? _currentUserService.GetUserId();
        var cacheKey = $"recommend:{userId ?? 0}:{request.ProductId ?? 0}:{request.CategoryId ?? 0}";
        var cachedJson = await _redisService.GetAsync(cacheKey);
        if (!string.IsNullOrEmpty(cachedJson))
        {
            return JsonSerializer.Deserialize<List<ProductRecommendationDto>>(cachedJson);
        }

        var popularProducts = await GetPopularityBasedAsync(request.CategoryId);
        var contentProducts = await GetContentBasedAsync(request.ProductId, userId);
        var collaborativeProducts = await GetCollaborativeBasedAsync(userId);

        var w1 = collaborativeProducts.Any() ? 0.4 : 0;
        var w2 = collaborativeProducts.Any() ? 0.25 : 0.6;

        var combinedScores = new Dictionary<int, double>();
        foreach (var product in popularProducts.Concat(contentProducts).Concat(collaborativeProducts).Distinct())
        {
            double score = w1 * (collaborativeProducts.Contains(product) ? 1 : 0) +
                          0.35 * (contentProducts.Contains(product) ? 1 : 0) +
                          w2 * (popularProducts.Contains(product) ? 1 : 0);
            combinedScores[product.Id] = score;
        }

        var result = new List<ProductRecommendationDto>();
        foreach (var id in combinedScores.OrderByDescending(x => x.Value).Take(request.Limit).Select(x => x.Key))
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product != null)
            {
                var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                if (defaultItem != null)
                {
                    result.Add(new ProductRecommendationDto
                    {
                        Id = product.Id,
                        Name = product.Name,
                        ProductCategoryId = product.ProductCategoryId,
                        Price = defaultItem.Price
                    });
                }
            }
        }

        // Fallback logic: Đảm bảo tối thiểu 7 sản phẩm
        if (result.Count < MINIMUM_PRODUCTS)
        {
            Console.WriteLine($"Chưa đủ sản phẩm còn thiếu {result.Count - MINIMUM_PRODUCTS}");
            int remainingCount = MINIMUM_PRODUCTS - result.Count;

            // Bước 1: Lấy thêm sản phẩm phổ biến toàn hệ thống
            var additionalPopular = await _popularityStatRepository.GetPopularProductsAsync(null, remainingCount);
            foreach (var product in additionalPopular)
            {
                if (!result.Any(r => r.Id == product.Id))
                {
                    var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                    if (defaultItem != null)
                    {
                        result.Add(new ProductRecommendationDto
                        {
                            Id = product.Id,
                            Name = product.Name,
                            ProductCategoryId = product.ProductCategoryId,
                            Price = defaultItem.Price
                        });
                    }
                }
            }

            // Bước 2: Nếu vẫn không đủ, lấy sản phẩm từ danh mục liên quan
            if (result.Count < MINIMUM_PRODUCTS && request.CategoryId.HasValue)
            {
                remainingCount = MINIMUM_PRODUCTS - result.Count;
                var relatedCategories = await _productRepository.GetRelatedCategoriesAsync(request.CategoryId.Value);
                foreach (var categoryId in relatedCategories)
                {
                    var relatedProducts = await _productRepository.GetByCategoryIdAsync(categoryId, remainingCount);
                    foreach (var product in relatedProducts)
                    {
                        if (!result.Any(r => r.Id == product.Id))
                        {
                            var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                            if (defaultItem != null)
                            {
                                result.Add(new ProductRecommendationDto
                                {
                                    Id = product.Id,
                                    Name = product.Name,
                                    ProductCategoryId = product.ProductCategoryId,
                                    Price = defaultItem.Price
                                });
                                remainingCount--;
                                if (result.Count >= MINIMUM_PRODUCTS) break;
                            }
                        }
                    }
                    if (result.Count >= MINIMUM_PRODUCTS) break;
                }
            }

            // Bước 3: Nếu vẫn không đủ, lấy sản phẩm ngẫu nhiên
            if (result.Count < MINIMUM_PRODUCTS)
            {
                remainingCount = MINIMUM_PRODUCTS - result.Count;
                var randomProducts = await _productRepository.GetRandomProductsAsync(remainingCount);
                foreach (var product in randomProducts)
                {
                    if (!result.Any(r => r.Id == product.Id))
                    {
                        var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                        if (defaultItem != null)
                        {
                            result.Add(new ProductRecommendationDto
                            {
                                Id = product.Id,
                                Name = product.Name,
                                ProductCategoryId = product.ProductCategoryId,
                                Price = defaultItem.Price
                            });
                        }
                    }
                }
            }
        }

        var resultJson = JsonSerializer.Serialize(result);
        await _redisService.SetAsync(cacheKey, resultJson, TimeSpan.FromHours(6));

        return result;
    }

    private async Task<List<Product>> GetPopularityBasedAsync(int? categoryId)
    {
        var cacheKey = $"popularity:{categoryId ?? 0}";
        var cachedJson = await _redisService.GetAsync(cacheKey);
        if (!string.IsNullOrEmpty(cachedJson))
        {
            return JsonSerializer.Deserialize<List<Product>>(cachedJson);
        }

        var products = await _popularityStatRepository.GetPopularProductsAsync(categoryId, 10);

        // Chuyển đổi sang ProductRecommendationDto để serialize
        var dtos = products
            .Select(p => 
            {
                var defaultItem = p.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                return defaultItem != null ? new ProductRecommendationDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ProductCategoryId = p.ProductCategoryId,
                    Price = defaultItem.Price
                } : null;
            })
            .Where(dto => dto != null)
            .ToList();

        var productsJson = JsonSerializer.Serialize(dtos);
        await _redisService.SetAsync(cacheKey, productsJson, TimeSpan.FromHours(6));
        return products;
    }

    private async Task<List<Product>> GetContentBasedAsync(int? productId, int? userId)
    {
        if (!productId.HasValue && !userId.HasValue)
            return new List<Product>();

        var products = new List<Product>();
        if (productId.HasValue)
        {
            var currentProduct = await _productRepository.GetByIdAsync(productId.Value);
            if (currentProduct != null)
            {
                products.AddRange(await _productRepository.GetByCategoryIdAsync(currentProduct.ProductCategoryId, 10));
                products.RemoveAll(p => p.Id == productId.Value);
            }
        }

        if (userId.HasValue)
        {
            var recentSearch = await _userSearchRepository.GetRecentSearchKeywordAsync(userId.Value);
            if (!string.IsNullOrEmpty(recentSearch))
            {
                var searchProducts = await _productRepository.GetByCategoryIdAsync(0, 10); // Giả lập, cần repository hỗ trợ tìm kiếm
                products.AddRange(searchProducts.Where(p => p.Name.Contains(recentSearch, StringComparison.OrdinalIgnoreCase)));
            }
        }

        return products.Take(10).ToList();
    }

    private async Task<List<Product>> GetCollaborativeBasedAsync(int? userId)
    {
        if (!userId.HasValue || await _userViewHistoryRepository.GetCountAsync() < 50)
            return new List<Product>();

        var viewedProductIds = await _userViewHistoryRepository.GetViewedProductIdsAsync(userId.Value);
        return await _productSimilarityRepository.GetSimilarProductsAsync(viewedProductIds, 10);
    }
}