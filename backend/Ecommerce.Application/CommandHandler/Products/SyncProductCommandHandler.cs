using System.Text.Json;
using Ecommerce.Application.Command;
using Ecommerce.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler;

public class SyncProductCommandHandler : IRequestHandler<SyncProductCommand, Unit>
{
    private readonly IProductItemRepository _productItemRepository;
    private readonly IRabbitMQService _rabbiMQService;
    private readonly ILogger<SyncProductCommandHandler> _logger;

    public SyncProductCommandHandler(
        IProductItemRepository productItemRepository,
        IRabbitMQService rabbitMQService,
        ILogger<SyncProductCommandHandler> logger
    )
    {
        _productItemRepository = productItemRepository;
        _rabbiMQService = rabbitMQService;
        _logger = logger;
    }

    public async Task<Unit> Handle(SyncProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productItemRepository.GetProductWithDefaultItemAsync(request.ProductId, cancellationToken);
        if (product == null && request.Action != "delete")
            throw new Exception($"Product with ID {request.ProductId} not found");

        var defaultItem = product?.ProductItems?.FirstOrDefault(pi => pi.IsDefault);
        if (defaultItem == null && request.Action != "delete")
            throw new Exception("No default ProductItem found");

        // Xử lý suggestion: Tách chuỗi thành mảng và kiểm tra độ dài
        var suggestionInput = new List<string>();
        const int maxSuggestionLength = 50; // Giới hạn từ mapping Elasticsearch
        if (!string.IsNullOrWhiteSpace(product?.Suggestion))
        {
            suggestionInput = product.Suggestion
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Select(s => s.Length > maxSuggestionLength ? s.Substring(0, maxSuggestionLength) : s)
                .ToList();
        }

        // Đảm bảo có ít nhất một gợi ý (fallback nếu suggestion rỗng)
        if (!suggestionInput.Any() && defaultItem != null)
        {
            suggestionInput.Add(defaultItem.SKU?.Length > maxSuggestionLength 
                ? defaultItem.SKU.Substring(0, maxSuggestionLength) 
                : defaultItem.SKU ?? "default_sku");
        }

        var message = new
        {
            productId = request.ProductId,
            itemId = defaultItem?.Id,
            action = request.Action,
            elasticsearchId = product?.ElasticsearchId,
            data = defaultItem != null ? new
            {
                name = product.Name,
                description = "",
                category = product.ProductCategory?.Name,
                sub_category = product.ProductCategory?.Parent?.Name,
                brand = product.Brand?.Name,
                price = defaultItem.Price,
                old_price = defaultItem.OldPrice,
                stock = defaultItem.QtyInStock,
                sku = defaultItem.SKU,
                image_url = defaultItem.ImageUrl,
                has_variation = product.HasVariation,
                rating = product.Rating,
                total_rating_count = product.TotalRatingCount,
                status = defaultItem.IsStatus,
                variations = defaultItem.ProductConfigurations.Select(pc => new
                {
                    variation_id = pc.VariationOption.VariationId,
                    variation_value = pc.VariationOption.Variation.Value,
                    option_id = pc.VariationOptionId,
                    option_value = pc.VariationOption.Value
                }).ToList(),
                suggestion = new
                {
                    input = suggestionInput,
                    weight = 1 
                }
            } : null
        };

        var messageJson = JsonSerializer.Serialize(message);
        
        try
        {
            await _rabbiMQService.PublishMessageAsync("product_sync_queue", messageJson);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish message to product_sync_queue for productId={ProductId}, action={Action}", request.ProductId, request.Action);
            throw;
        }

        return Unit.Value;
    }
}