using MediatR;

namespace Ecommerce.Application.Commands.Products;

public class DeleteProductCommand : IRequest<bool>
{
    public int Id { get; }

    public DeleteProductCommand(int id)
    {
        Id = id;
    }
} 