using Ecommerce.Application.Common.DTOs.Wishlist;
using MediatR;

namespace Ecommerce.Application.Queries.Wishlist;

public class GetUserWishlistQuery : IRequest<List<WishlistItemDto>>
{
    public int UserId { get; set; }
}

