using Ecommerce.Application.Common.DTOs.Wishlist;
using MediatR;

namespace Ecommerce.Application.Commands.Wishlist;

public class AddWishlistItemCommand : IRequest<WishlistItemDto>
{
    public int UserId { get; set; }
    public int ProductId { get; set; }
}

