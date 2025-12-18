using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using System;
using System.Text.Json;
using System.Threading;
using System.Linq;

namespace Ecommerce.Application.Services;
public class ProductSimilarityService
{
    private readonly IProductSimilarityRepository _productSimilarityRepository;
    private readonly IProductRepository _productRepository;
    private readonly IRedisService _redisService;

    public ProductSimilarityService(
        IProductSimilarityRepository productSimilarityRepository,
        IProductRepository productRepository,
        IRedisService redisService)
    {
        _productSimilarityRepository = productSimilarityRepository;
        _productRepository = productRepository;
        _redisService = redisService;
    }

    public async Task UpdateSimilaritiesAsync(CancellationToken cancellationToken = default)
    {
        var cacheKey = "product_similarities";
        var products = await _productRepository.GetAllWithBasicInfoAsync(cancellationToken);

        var vectors = products.ToDictionary(p => p.Id, BuildFeatureVector);

        var similarities = new List<ProductSimilarity>();
        foreach (var (id1, vec1) in vectors)
        {
            foreach (var (id2, vec2) in vectors.Where(kv => kv.Key > id1))
            {
                var similarity = CalculateCosineSimilarity(vec1, vec2);
                if (similarity >= 0.15)
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

        var topSimilarities = similarities
            .SelectMany(ps => new[]
            {
                (Key: ps.ProductId1, Value: ps),
                (Key: ps.ProductId2, Value: new ProductSimilarity
                {
                    ProductId1 = ps.ProductId2,
                    ProductId2 = ps.ProductId1,
                    Similarity = ps.Similarity
                })
            })
            .GroupBy(x => x.Key)
            .SelectMany(g => g
                .OrderByDescending(x => x.Value.Similarity)
                .Take(20)
                .Select(x => x.Value))
            .Where(ps => ps.ProductId1 < ps.ProductId2)
            .DistinctBy(ps => (ps.ProductId1, ps.ProductId2))
            .ToList();

        await _productSimilarityRepository.ReplaceAllAsync(topSimilarities, cancellationToken);

        // Serialize chỉ dữ liệu cần thiết để tránh circular reference
        var cacheData = topSimilarities.Select(ps => new
        {
            ProductId1 = ps.ProductId1,
            ProductId2 = ps.ProductId2,
            Similarity = ps.Similarity
        }).ToList();
        
        var similaritiesJson = JsonSerializer.Serialize(cacheData);
        await _redisService.SetAsync(cacheKey, similaritiesJson, TimeSpan.FromDays(1));
    }

    private Dictionary<string, double> BuildFeatureVector(Product product)
    {
        var vector = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase);
        void Add(string key, double value = 1.0)
        {
            if (vector.ContainsKey(key)) vector[key] += value;
            else vector[key] = value;
        }

        Add($"cat:{product.ProductCategoryId}");

        // BrandId là int không nullable, vẫn kiểm tra > 0 để tránh dữ liệu rác
        if (product.BrandId > 0)
            Add($"brand:{product.BrandId}");

        var defaultItem = product.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
        if (defaultItem != null)
        {
            var price = (double)defaultItem.Price;
            var bucket = price <= 0 ? 0 : (int)Math.Clamp(Math.Log10(price + 1), 0, 8);
            Add($"price_bucket:{bucket}");
        }

        foreach (var token in Tokenize(product.Name))
        {
            Add($"name:{token}", 1);
        }

        return vector;
    }

    private static IEnumerable<string> Tokenize(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) yield break;
        var parts = text
            .ToLowerInvariant()
            .Split(new[] { ' ', '-', '/', '_', '.', ',', ';', ':', '|', '(', ')', '[', ']', '{', '}', '+' }, StringSplitOptions.RemoveEmptyEntries);
        foreach (var p in parts)
        {
            if (p.Length <= 2) continue;
            yield return p;
        }
    }

    private double CalculateCosineSimilarity(
        Dictionary<string, double> vec1,
        Dictionary<string, double> vec2)
    {
        var (small, large) = vec1.Count <= vec2.Count ? (vec1, vec2) : (vec2, vec1);

        double dot = 0;
        foreach (var kvp in small)
        {
            if (large.TryGetValue(kvp.Key, out var v))
            {
                dot += kvp.Value * v;
            }
        }

        double norm1 = Math.Sqrt(vec1.Values.Sum(v => v * v));
        double norm2 = Math.Sqrt(vec2.Values.Sum(v => v * v));
        return dot / (norm1 * norm2 + 1e-8);
    }
}