using Ecommerce.Application.Common.DTOs.Wishlist;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Wishlist;
using Ecommerce.Domain.Entities;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Wishlist;

public class GetUserWishlistQueryHandler : IRequestHandler<GetUserWishlistQuery, List<WishlistItemDto>>
{
    private readonly IWishlistRepository _wishlistRepository;

    public GetUserWishlistQueryHandler(IWishlistRepository wishlistRepository)
    {
        _wishlistRepository = wishlistRepository;
    }

    public async Task<List<WishlistItemDto>> Handle(GetUserWishlistQuery request, CancellationToken cancellationToken)
    {
        var items = await _wishlistRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        return items
            .Where(item => item.Product != null) // Filter out items with deleted products
            .Select(MapToDto)
            .ToList();
    }

    private static WishlistItemDto MapToDto(WishlistItem item)
    {
        if (item.Product == null)
        {
            throw new InvalidOperationException($"Wishlist item {item.Id} missing product data");
        }

        var product = item.Product;

        var defaultProductItem = product.ProductItems?
            .FirstOrDefault(pi => pi.IsDefault) ?? product.ProductItems?.FirstOrDefault();

        var imageUrl = defaultProductItem?.ImageUrl
                       ?? product.ProductImages?.FirstOrDefault()?.ImageUrl
                       ?? string.Empty;

        return new WishlistItemDto
        {
            Id = item.Id,
            ProductId = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            ImageUrl = imageUrl,
            Price = defaultProductItem?.Price ?? 0,
            OldPrice = defaultProductItem?.OldPrice ?? 0,
            Currency = product.Currency,
            HasVariation = product.HasVariation,
            QtyInStock = defaultProductItem?.QtyInStock ?? product.QtyInStock,
            ProductItemId = defaultProductItem?.Id,
            CategoryId = product.ProductCategoryId,
            AddedAt = item.CreatedAt
        };
    }
}

