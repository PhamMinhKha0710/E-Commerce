using Ecommerce.Application.Common.DTOs.Product;
using MediatR;

namespace Ecommerce.Application.Commands.Products;

public class UpdateProductCommand : IRequest<AdminProductDto>
{
    public int Id { get; }
    public CreateUpdateProductDto Product { get; }

    public UpdateProductCommand(int id, CreateUpdateProductDto product)
    {
        Id = id;
        Product = product;
    }
} 