// Ecommerce.Application/Services/ProductSimilarityService.cs
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using System.Text.Json;

namespace Ecommerce.Application.Services;
public class ProductSimilarityService
{
    private readonly IUserViewHistoryRepository _userViewHistoryRepository;
    private readonly IProductSimilarityRepository _productSimilarityRepository;
    private readonly IRedisService _redisService;

    public ProductSimilarityService(
        IUserViewHistoryRepository userViewHistoryRepository,
        IProductSimilarityRepository productSimilarityRepository,
        IRedisService redisService)
    {
        _userViewHistoryRepository = userViewHistoryRepository;
        _productSimilarityRepository = productSimilarityRepository;
        _redisService = redisService;
    }

    public async Task UpdateSimilaritiesAsync()
    {
        var cacheKey = "product_similarities";
        var productIds = await _userViewHistoryRepository.GetDistinctProductIdsAsync();

        var similarities = new List<ProductSimilarity>();
        foreach (var id1 in productIds)
        {
            foreach (var id2 in productIds.Where(id => id > id1))
            {
                var similarity = await CalculateCosineSimilarityAsync(id1, id2);
                if (similarity > 0.1)
                {
                    similarities.Add(new ProductSimilarity
                    {
                        ProductId1 = id1,
                        ProductId2 = id2,
                        Similarity = similarity
                    });
                }
            }
        }

        await _productSimilarityRepository.AddRangeAsync(similarities);

        var similaritiesJson = JsonSerializer.Serialize(similarities);
        await _redisService.SetAsync(cacheKey, similaritiesJson, TimeSpan.FromDays(1));
    }

    private async Task<double> CalculateCosineSimilarityAsync(int productId1, int productId2)
    {
        var users1 = await _userViewHistoryRepository.GetViewedProductIdsAsync(productId1);
        var users2 = await _userViewHistoryRepository.GetViewedProductIdsAsync(productId2);

        var commonUsers = users1.Intersect(users2).Count();
        var norm1 = Math.Sqrt(users1.Count);
        var norm2 = Math.Sqrt(users2.Count);
        return commonUsers / (norm1 * norm2 + 0.0001);
    }
}