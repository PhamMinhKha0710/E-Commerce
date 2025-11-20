using Ecommerce.Application.Commands.Wishlist;
using Ecommerce.Application.Common.DTOs.Wishlist;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.CommandHandler.Wishlist;

public class AddWishlistItemCommandHandler : IRequestHandler<AddWishlistItemCommand, WishlistItemDto>
{
    private readonly IWishlistRepository _wishlistRepository;
    private readonly IProductRepository _productRepository;

    public AddWishlistItemCommandHandler(
        IWishlistRepository wishlistRepository,
        IProductRepository productRepository)
    {
        _wishlistRepository = wishlistRepository;
        _productRepository = productRepository;
    }

    public async Task<WishlistItemDto> Handle(AddWishlistItemCommand request, CancellationToken cancellationToken)
    {
        var existingItem = await _wishlistRepository.GetItemAsync(request.UserId, request.ProductId, cancellationToken);
        if (existingItem != null)
        {
            await EnsureProductLoadedAsync(existingItem, cancellationToken);
            return MapToDto(existingItem);
        }

        var product = await _productRepository.Query()
            .Include(p => p.ProductItems)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

        if (product == null)
        {
            throw new InvalidOperationException($"Product with id {request.ProductId} was not found");
        }

        var wishlistItem = new WishlistItem
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
            Product = product
        };

        await _wishlistRepository.AddAsync(wishlistItem, cancellationToken);

        return MapToDto(wishlistItem);
    }

    private async Task EnsureProductLoadedAsync(WishlistItem wishlistItem, CancellationToken cancellationToken)
    {
        if (wishlistItem.Product != null &&
            wishlistItem.Product.ProductItems != null &&
            wishlistItem.Product.ProductImages != null)
        {
            return;
        }

        var product = await _productRepository.Query()
            .Include(p => p.ProductItems)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == wishlistItem.ProductId, cancellationToken);

        wishlistItem.Product = product ?? wishlistItem.Product;
    }

    private static WishlistItemDto MapToDto(WishlistItem item)
    {
        if (item.Product == null)
        {
            throw new InvalidOperationException("Wishlist item is missing product information");
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

