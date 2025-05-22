using Ecommerce.Application.Common.DTOs.Product;
using MediatR;

namespace Ecommerce.Application.Commands.Products;

public class CreateProductVariantCommand : IRequest<ProductVariantDetailsDto>
{
    public int ProductId { get; }
    public CreateProductVariantDto Variant { get; }

    public CreateProductVariantCommand(int productId, CreateProductVariantDto variant)
    {
        ProductId = productId;
        Variant = variant;
    }
} 