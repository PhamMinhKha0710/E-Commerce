using Ecommerce.Application.Command;
using Ecommerce.Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler;

public class SyncAllProductsCommandHandler : IRequestHandler<SyncAllProductsCommand, SyncAllProductsResponse>
{
    private readonly IProductRepository _productRepository;
    private readonly IMediator _mediator;
    private readonly ILogger<SyncAllProductsCommandHandler> _logger;

    public SyncAllProductsCommandHandler(
        IProductRepository productRepository,
        IMediator mediator,
        ILogger<SyncAllProductsCommandHandler> logger
    )
    {
        _productRepository = productRepository;
        _mediator = mediator;
        _logger = logger;
    }

    public async Task<SyncAllProductsResponse> Handle(SyncAllProductsCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting sync all products with action: {Action}", request.Action);

        // Lấy tất cả sản phẩm
        var allProducts = await _productRepository.GetAllAsync();
        var totalProducts = allProducts.Count;
        
        _logger.LogInformation("Found {Count} products to sync", totalProducts);

        var response = new SyncAllProductsResponse
        {
            TotalProducts = totalProducts,
            SuccessCount = 0,
            FailedCount = 0,
            FailedProductIds = new List<int>()
        };

        if (totalProducts == 0)
        {
            response.Message = "No products found to sync";
            return response;
        }

        // Đồng bộ từng sản phẩm
        foreach (var product in allProducts)
        {
            try
            {
                var syncCommand = new SyncProductCommand
                {
                    ProductId = product.Id,
                    Action = request.Action
                };

                await _mediator.Send(syncCommand, cancellationToken);
                response.SuccessCount++;
                
                _logger.LogInformation("Successfully synced product {ProductId}", product.Id);
            }
            catch (Exception ex)
            {
                response.FailedCount++;
                response.FailedProductIds.Add(product.Id);
                _logger.LogError(ex, "Failed to sync product {ProductId}", product.Id);
            }
        }

        response.Message = $"Sync completed: {response.SuccessCount} succeeded, {response.FailedCount} failed out of {totalProducts} total products";
        _logger.LogInformation(response.Message);

        return response;
    }
}






















