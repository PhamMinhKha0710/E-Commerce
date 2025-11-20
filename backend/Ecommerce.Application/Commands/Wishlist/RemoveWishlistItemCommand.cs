using MediatR;

namespace Ecommerce.Application.Commands.Wishlist;

public class RemoveWishlistItemCommand : IRequest<bool>
{
    public int UserId { get; set; }
    public int ProductId { get; set; }
}

