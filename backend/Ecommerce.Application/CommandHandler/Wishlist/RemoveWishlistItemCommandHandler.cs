using Ecommerce.Application.Commands.Wishlist;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Wishlist;

public class RemoveWishlistItemCommandHandler : IRequestHandler<RemoveWishlistItemCommand, bool>
{
    private readonly IWishlistRepository _wishlistRepository;

    public RemoveWishlistItemCommandHandler(IWishlistRepository wishlistRepository)
    {
        _wishlistRepository = wishlistRepository;
    }

    public async Task<bool> Handle(RemoveWishlistItemCommand request, CancellationToken cancellationToken)
    {
        var existingItem = await _wishlistRepository.GetItemAsync(request.UserId, request.ProductId, cancellationToken);
        if (existingItem == null)
        {
            return false;
        }

        await _wishlistRepository.RemoveAsync(existingItem, cancellationToken);
        return true;
    }
}


