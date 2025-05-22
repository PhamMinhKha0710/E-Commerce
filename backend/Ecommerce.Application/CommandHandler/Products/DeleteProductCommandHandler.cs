using System;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Commands.Products;
using MediatR;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Application.CommandHandler.Products;

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, bool>
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<DeleteProductCommandHandler> _logger;

    public DeleteProductCommandHandler(IProductRepository productRepository, ILogger<DeleteProductCommandHandler> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var product = await _productRepository.GetProductDetailByIdAsync(request.Id, cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Attempted to delete non-existent product with ID: {ProductId}", request.Id);
                return false;
            }

            // Delete product images
            var productImages = await _productRepository.GetProductImagesByProductIdAsync(request.Id, cancellationToken);
            
            foreach (var image in productImages)
            {
                await _productRepository.DeleteProductImageAsync(image, cancellationToken);
            }

            // Delete product items
            var productItems = await _productRepository.GetProductItemsByProductIdAsync(request.Id);
            
            foreach (var item in productItems)
            {
                await _productRepository.DeleteProductItemAsync(item, cancellationToken);
            }

            // Delete the product itself
            await _productRepository.DeleteAsync(product, cancellationToken);

            _logger.LogInformation("Product with ID: {ProductId} deleted successfully", request.Id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product with ID: {ProductId}", request.Id);
            throw;
        }
    }
} 