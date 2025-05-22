using MediatR;

namespace Ecommerce.Application.Commands.Products;

public class DeleteProductVariantCommand : IRequest<bool>
{
    public int ProductId { get; }
    public int VariantId { get; }

    public DeleteProductVariantCommand(int productId, int variantId)
    {
        ProductId = productId;
        VariantId = variantId;
    }
} 