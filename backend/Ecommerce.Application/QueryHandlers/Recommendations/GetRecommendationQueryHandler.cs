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

        var popularProducts = await GetPopularityBasedAsync(request.CategoryId, cancellationToken);
        var contentProducts = await GetContentBasedAsync(request.ProductId, userId, request.CategoryId, cancellationToken);
        var collaborativeProducts = await GetCollaborativeBasedAsync(userId, request.CategoryId);

        // Hybrid weighting: Ưu tiên category khi có categoryId
        double wContent, wPopular, wCollaborative;
        if (request.CategoryId.HasValue)
        {
            // Khi có categoryId: Ưu tiên content-based và popularity trong category
            wContent = collaborativeProducts.Any() ? 0.45 : 0.5;
            wPopular = collaborativeProducts.Any() ? 0.35 : 0.4;
            wCollaborative = collaborativeProducts.Any() ? 0.2 : 0;
        }
        else
        {
            // Khi không có categoryId: Cân bằng hơn
            wContent = collaborativeProducts.Any() ? 0.35 : 0.4;
            wPopular = collaborativeProducts.Any() ? 0.25 : 0.5;
            wCollaborative = collaborativeProducts.Any() ? 0.4 : 0;
        }

        var combinedScores = new Dictionary<int, double>();
        var allProducts = popularProducts.Concat(contentProducts).Concat(collaborativeProducts).Distinct().ToList();
        
        foreach (var product in allProducts)
        {
            // Nếu có categoryId, chỉ tính điểm cho sản phẩm cùng category
            if (request.CategoryId.HasValue && product.ProductCategoryId != request.CategoryId.Value)
            {
                continue; // Bỏ qua sản phẩm khác category
            }
            
            double score = 0;
            
            // Content-based score
            if (contentProducts.Contains(product))
            {
                score += wContent;
                // Bonus nếu cùng category với request
                if (request.CategoryId.HasValue && product.ProductCategoryId == request.CategoryId.Value)
                    score += 0.1;
            }
            
            // Popularity score
            if (popularProducts.Contains(product))
            {
                score += wPopular;
                // Bonus nếu cùng category với request
                if (request.CategoryId.HasValue && product.ProductCategoryId == request.CategoryId.Value)
                    score += 0.1;
            }
            
            // Collaborative score
            if (collaborativeProducts.Contains(product))
            {
                score += wCollaborative;
            }
            
            combinedScores[product.Id] = score;
        }

        var result = new List<ProductRecommendationDto>();
        var sortedProductIds = combinedScores.OrderByDescending(x => x.Value).Select(x => x.Key).ToList();
        
        // Nếu có categoryId và không đủ sản phẩm, lấy thêm từ cùng category
        if (request.CategoryId.HasValue && sortedProductIds.Count < request.Limit)
        {
            var additionalFromCategory = await _productRepository.GetByCategoryIdAsync(
                request.CategoryId.Value, 
                request.Limit - sortedProductIds.Count, 
                cancellationToken);
            
            foreach (var product in additionalFromCategory)
            {
                if (!sortedProductIds.Contains(product.Id))
                {
                    sortedProductIds.Add(product.Id);
                }
            }
        }
        
        foreach (var id in sortedProductIds.Take(request.Limit))
        {
            var product = await _productRepository.GetByIdAsync(id, cancellationToken);
            if (product != null)
            {
                var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                var primaryImage = product.ProductImages?.FirstOrDefault()?.ImageUrl;
                if (defaultItem != null)
                {
                    // Tính toán giảm giá
                    string discount = null;
                    if (defaultItem.OldPrice > defaultItem.Price && defaultItem.OldPrice > 0)
                    {
                        var discountPercent = Math.Round(((defaultItem.OldPrice - defaultItem.Price) / defaultItem.OldPrice) * 100);
                        discount = $"{discountPercent}%";
                    }

                    result.Add(new ProductRecommendationDto
                    {
                        CategoryId = product.ProductCategoryId,
                        ProductId = product.Id,
                        ProductName = product.Name,
                        Href = $"/products/{product.Id}-{product.Slug}",
                        Slug = product.Slug,
                        ImageUrl = defaultItem.ImageUrl ?? primaryImage ?? "default-image.jpg",
                        Price = $"{defaultItem.Price:N0} {product.Currency}",
                        ComparePrice = defaultItem.OldPrice > 0 ? $"{defaultItem.OldPrice:N0} {product.Currency}" : null,
                        Discount = discount,
                        HasVariations = product.HasVariation,
                        Contact = defaultItem.Price <= 0,
                        ProductItemId = defaultItem.Id
                    });
                }
            }
        }

        // Fallback logic: Đảm bảo tối thiểu 7 sản phẩm
        if (result.Count < MINIMUM_PRODUCTS)
        {
            Console.WriteLine($"Chưa đủ sản phẩm, còn thiếu {MINIMUM_PRODUCTS - result.Count}");
            int remainingCount = MINIMUM_PRODUCTS - result.Count;

            // Bước 1: Lấy thêm sản phẩm phổ biến
            var additionalPopular = await _popularityStatRepository.GetPopularProductsAsync(null, remainingCount);
            foreach (var product in additionalPopular)
            {
                if (!result.Any(r => r.ProductId == product.Id))
                {
                    var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                    var primaryImage = product.ProductImages?.FirstOrDefault()?.ImageUrl;
                    if (defaultItem != null)
                    {
                        string discount = null;
                        if (defaultItem.OldPrice > defaultItem.Price && defaultItem.OldPrice > 0)
                        {
                            var discountPercent = Math.Round(((defaultItem.OldPrice - defaultItem.Price) / defaultItem.OldPrice) * 100);
                            discount = $"{discountPercent}%";
                        }

                        result.Add(new ProductRecommendationDto
                        {
                            CategoryId = product.ProductCategoryId,
                            ProductId = product.Id,
                            ProductName = product.Name,
                            Href = $"/products/{product.Id}-{product.Slug}",
                            Slug = product.Slug,
                            ImageUrl = defaultItem.ImageUrl ?? primaryImage ?? "default-image.jpg",
                            Price = $"{defaultItem.Price:N0} {product.Currency}",
                            ComparePrice = defaultItem.OldPrice > 0 ? $"{defaultItem.OldPrice:N0} {product.Currency}" : null,
                            Discount = discount,
                            HasVariations = product.HasVariation,
                            Contact = defaultItem.Price <= 0,
                            ProductItemId = defaultItem.Id
                        });
                    }
                }
            }

            // Bước 2: Lấy sản phẩm từ danh mục liên quan
            if (result.Count < MINIMUM_PRODUCTS && request.CategoryId.HasValue)
            {
                remainingCount = MINIMUM_PRODUCTS - result.Count;
                var relatedCategories = await _productRepository.GetRelatedCategoriesAsync(request.CategoryId.Value);
                foreach (var categoryId in relatedCategories)
                {
                    var relatedProducts = await _productRepository.GetByCategoryIdAsync(categoryId, remainingCount, cancellationToken);
                    foreach (var product in relatedProducts)
                    {
                        if (!result.Any(r => r.ProductId == product.Id))
                        {
                            var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                            var primaryImage = product.ProductImages?.FirstOrDefault()?.ImageUrl;
                            if (defaultItem != null)
                            {
                                string discount = null;
                                if (defaultItem.OldPrice > defaultItem.Price && defaultItem.OldPrice > 0)
                                {
                                    var discountPercent = Math.Round(((defaultItem.OldPrice - defaultItem.Price) / defaultItem.OldPrice) * 100);
                                    discount = $"{discountPercent}%";
                                }

                                result.Add(new ProductRecommendationDto
                                {
                                    CategoryId = product.ProductCategoryId,
                                    ProductId = product.Id,
                                    ProductName = product.Name,
                                    Href = $"/products/{product.Id}-{product.Slug}",
                                    Slug = product.Slug,
                                    ImageUrl = defaultItem.ImageUrl ?? primaryImage ?? "default-image.jpg",
                                    Price = $"{defaultItem.Price:N0} {product.Currency}",
                                    ComparePrice = defaultItem.OldPrice > 0 ? $"{defaultItem.OldPrice:N0} {product.Currency}" : null,
                                    Discount = discount,
                                    HasVariations = product.HasVariation,
                                    Contact = defaultItem.Price <= 0,
                                    ProductItemId = defaultItem.Id
                                });
                                remainingCount--;
                                if (result.Count >= MINIMUM_PRODUCTS) break;
                            }
                        }
                    }
                    if (result.Count >= MINIMUM_PRODUCTS) break;
                }
            }

            // Bước 3: Lấy sản phẩm ngẫu nhiên
            if (result.Count < MINIMUM_PRODUCTS)
            {
                remainingCount = MINIMUM_PRODUCTS - result.Count;
                var randomProducts = await _productRepository.GetRandomProductsAsync(remainingCount, cancellationToken);
                foreach (var product in randomProducts)
                {
                    if (!result.Any(r => r.ProductId == product.Id))
                    {
                        var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                        var primaryImage = product.ProductImages?.FirstOrDefault()?.ImageUrl;
                        if (defaultItem != null)
                        {
                            string discount = null;
                            if (defaultItem.OldPrice > defaultItem.Price && defaultItem.OldPrice > 0)
                            {
                                var discountPercent = Math.Round(((defaultItem.OldPrice - defaultItem.Price) / defaultItem.OldPrice) * 100);
                                discount = $"{discountPercent}%";
                            }

                            result.Add(new ProductRecommendationDto
                            {
                                CategoryId = product.ProductCategoryId,
                                ProductId = product.Id,
                                ProductName = product.Name,
                                Href = $"/products/{product.Id}-{product.Slug}",
                                Slug = product.Slug,
                                ImageUrl = defaultItem.ImageUrl ?? primaryImage ?? "default-image.jpg",
                                Price = $"{defaultItem.Price:N0} {product.Currency}",
                                ComparePrice = defaultItem.OldPrice > 0 ? $"{defaultItem.OldPrice:N0} {product.Currency}" : null,
                                Discount = discount,
                                HasVariations = product.HasVariation,
                                Contact = defaultItem.Price <= 0,
                                ProductItemId = defaultItem.Id
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

    private async Task<List<Product>> GetPopularityBasedAsync(int? categoryId, CancellationToken cancellationToken)
    {
        var cacheKey = $"popularity:{categoryId ?? 0}";
        var cachedJson = await _redisService.GetAsync(cacheKey);
        List<Product> products = null;
        List<ProductRecommendationDto> dtos = null;

        if (!string.IsNullOrEmpty(cachedJson))
        {
            dtos = JsonSerializer.Deserialize<List<ProductRecommendationDto>>(cachedJson);
            products = new List<Product>();
            foreach (var dto in dtos)
            {
                var product = await _productRepository.GetProductDetailByIdAsync(dto.ProductId, cancellationToken);
                if (product != null) products.Add(product);
            }
            return products;
        }

        products = await _popularityStatRepository.GetPopularProductsAsync(categoryId, 10);

        // Nếu chưa có thống kê độ phổ biến cho category này,
        // fallback trực tiếp sang danh sách sản phẩm trong category
        if ((products == null || !products.Any()) && categoryId.HasValue)
        {
            products = await _productRepository.GetByCategoryIdAsync(categoryId.Value, 10, cancellationToken);
        }

        dtos = products
            .Select(p =>
            {
                var defaultItem = p.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
                if (defaultItem == null) return null;
                var discount = defaultItem.OldPrice > defaultItem.Price
                    ? $"{Math.Round((defaultItem.OldPrice - defaultItem.Price) / defaultItem.OldPrice * 100)}%"
                    : null;
                return new ProductRecommendationDto
                {
                    CategoryId = p.ProductCategoryId,
                    ProductId = p.Id, // Giữ kiểu int
                    ProductName = p.Name,
                    Href = $"/products/{p.Id}-{p.Slug}",
                    Slug = p.Slug,
                    ImageUrl = defaultItem.ImageUrl,
                    Price = $"{defaultItem.Price:N0} VND",
                    ComparePrice = defaultItem.OldPrice > 0 ? $"{defaultItem.OldPrice:N0} VND" : null,
                    Discount = discount,
                    HasVariations = p.HasVariation,
                    Contact = defaultItem.QtyInStock == 0,
                    ProductItemId = defaultItem.Id
                };
            })
            .Where(dto => dto != null)
            .ToList();

        var productsJson = JsonSerializer.Serialize(dtos);
        await _redisService.SetAsync(cacheKey, productsJson, TimeSpan.FromHours(6));
        return products;
    }

    private async Task<List<Product>> GetContentBasedAsync(int? productId, int? userId, int? categoryId, CancellationToken cancellationToken)
    {
        var results = new List<Product>();

        // Primary: dùng bảng similarity đã tính sẵn
        if (productId.HasValue)
        {
            var similar = await _productSimilarityRepository.GetSimilarProductsAsync(new List<int> { productId.Value }, 15);
            if (similar.Any())
            {
                // Nếu có categoryId, ưu tiên sản phẩm cùng category
                if (categoryId.HasValue)
                {
                    var sameCategory = similar.Where(p => p.ProductCategoryId == categoryId.Value).ToList();
                    var otherCategory = similar.Where(p => p.ProductCategoryId != categoryId.Value).ToList();
                    results.AddRange(sameCategory);
                    results.AddRange(otherCategory.Take(5)); // Giới hạn khác category
                }
                else
                {
                    results.AddRange(similar);
                }
            }
        }

        // If user có lịch sử, lấy sản phẩm mới xem để suy ra content-based
        if (userId.HasValue && results.Count < 10)
            {
            var viewed = await _userViewHistoryRepository.GetViewedProductIdsAsync(userId.Value);
            if (viewed?.Any() == true)
            {
                var similar = await _productSimilarityRepository.GetSimilarProductsAsync(viewed.Take(3).ToList(), 15);
                if (similar.Any())
                {
                    // Nếu có categoryId, ưu tiên cùng category
                    if (categoryId.HasValue)
                    {
                        var sameCategory = similar.Where(p => p.ProductCategoryId == categoryId.Value && !results.Any(r => r.Id == p.Id)).ToList();
                        var otherCategory = similar.Where(p => p.ProductCategoryId != categoryId.Value && !results.Any(r => r.Id == p.Id)).Take(5).ToList();
                        results.AddRange(sameCategory);
                        results.AddRange(otherCategory);
                    }
                    else
                    {
                        results.AddRange(similar.Where(p => !results.Any(r => r.Id == p.Id)));
                    }
                }
            }
        }

        // Fallback: cùng danh mục nếu có categoryId hoặc productId
        if (results.Count < 10)
        {
            int? targetCategoryId = categoryId;
            if (!targetCategoryId.HasValue && productId.HasValue)
        {
                var currentProduct = await _productRepository.GetProductDetailByIdAsync(productId.Value, cancellationToken);
                targetCategoryId = currentProduct?.ProductCategoryId;
            }

            if (targetCategoryId.HasValue)
            {
                var byCategory = await _productRepository.GetByCategoryIdAsync(targetCategoryId.Value, 10, cancellationToken);
                if (productId.HasValue)
                    byCategory.RemoveAll(p => p.Id == productId.Value);
                
                results.AddRange(byCategory.Where(p => !results.Any(r => r.Id == p.Id)));
            }
        }

        return results.Take(15).ToList();
    }

    private async Task<List<Product>> GetCollaborativeBasedAsync(int? userId, int? categoryId)
    {
        if (!userId.HasValue || await _userViewHistoryRepository.GetCountAsync() < 50)
            return new List<Product>();

        var viewedProductIds = await _userViewHistoryRepository.GetViewedProductIdsAsync(userId.Value);
        var similar = await _productSimilarityRepository.GetSimilarProductsAsync(viewedProductIds, 15);
        
        // Nếu có categoryId, ưu tiên sản phẩm cùng category
        if (categoryId.HasValue && similar.Any())
        {
            var sameCategory = similar.Where(p => p.ProductCategoryId == categoryId.Value).ToList();
            var otherCategory = similar.Where(p => p.ProductCategoryId != categoryId.Value).Take(5).ToList();
            sameCategory.AddRange(otherCategory);
            return sameCategory;
        }
        
        return similar;
    }
}