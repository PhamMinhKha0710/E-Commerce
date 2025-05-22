using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ecommerce.Application.Commands.Products;
using MediatR;
using Microsoft.Extensions.Logging;
using Ecommerce.Application.Interfaces;

namespace Ecommerce.Application.CommandHandler.Products;

public class DeleteProductVariantCommandHandler : IRequestHandler<DeleteProductVariantCommand, bool>
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<DeleteProductVariantCommandHandler> _logger;

    public DeleteProductVariantCommandHandler(IProductRepository productRepository, ILogger<DeleteProductVariantCommandHandler> logger)
    {
        _productRepository = productRepository;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteProductVariantCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var productId = request.ProductId;
            var variantId = request.VariantId;

            // Get product and verify it exists
            var product = await _productRepository.GetProductDetailByIdAsync(productId, cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Attempted to delete variant from non-existent product. Product ID: {ProductId}", productId);
                return false;
            }

            // Get product variants
            var productItems = await _productRepository.GetProductItemsByProductIdAsync(productId);
            
            // Get product item (variant) and verify it exists
            var productItem = await _productRepository.GetProductVariantByIdAsync(productId, variantId, cancellationToken);

            if (productItem == null)
            {
                _logger.LogWarning("Attempted to delete non-existent variant. Product ID: {ProductId}, Variant ID: {VariantId}", 
                    productId, variantId);
                return false;
            }

            // Check if this is the only variant - can't delete the last one
            if (productItems.Count <= 1)
            {
                throw new Exception("Cannot delete the only variant of a product.");
            }

            // Delete the product item (variant)
            await _productRepository.DeleteProductItemAsync(productItem, cancellationToken);
            
            // If default variant is being deleted, set a new default
            if (productItem.IsDefault)
            {
                var newDefault = productItems.FirstOrDefault(pi => pi.Id != variantId);
                if (newDefault != null)
                {
                    newDefault.IsDefault = true;
                    await _productRepository.UpdateProductItemAsync(newDefault, cancellationToken);
                }
            }

            // Check if product still has variants after this deletion
            var remainingItems = await _productRepository.GetProductItemsByProductIdAsync(productId);
            product.HasVariation = remainingItems.Count > 1;
            await _productRepository.UpdateAsync(product, cancellationToken);

            _logger.LogInformation("Deleted variant {VariantId} from product {ProductId}", variantId, productId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting variant {VariantId} from product {ProductId}", 
                request.VariantId, request.ProductId);
            throw;
        }
    }
} 