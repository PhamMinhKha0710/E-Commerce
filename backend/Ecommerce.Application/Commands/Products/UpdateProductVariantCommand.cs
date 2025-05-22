using Ecommerce.Application.Common.DTOs.Product;
using MediatR;

namespace Ecommerce.Application.Commands.Products;

public class UpdateProductVariantCommand : IRequest<ProductVariantDetailsDto>
{
    public int ProductId { get; }
    public int VariantId { get; }
    public UpdateProductVariantDto Variant { get; }

    public UpdateProductVariantCommand(int productId, int variantId, UpdateProductVariantDto variant)
    {
        ProductId = productId;
        VariantId = variantId;
        Variant = variant;
    }
} 