using Ecommerce.Application.Common.DTOs.Product;
using MediatR;

namespace Ecommerce.Application.Commands.Products;

public class CreateProductCommand : IRequest<AdminProductDto>
{
    public CreateUpdateProductDto Product { get; }

    public CreateProductCommand(CreateUpdateProductDto product)
    {
        Product = product;
    }
} 