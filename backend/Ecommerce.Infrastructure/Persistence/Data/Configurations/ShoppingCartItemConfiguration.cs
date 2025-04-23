using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ShoppingCartItemConfiguration : IEntityTypeConfiguration<ShoppingCartItem>
{
    public void Configure(EntityTypeBuilder<ShoppingCartItem> builder)
    {
        builder.HasKey(sci => sci.Id);

        builder.Property(sci => sci.Qty)
               .IsRequired();

        builder.HasOne(sci => sci.ShoppingCart)
               .WithMany(sc => sc.ShoppingCartItems)
               .HasForeignKey(sci => sci.ShoppingCartId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(sci => sci.ProductItem)
               .WithMany(pi => pi.ShoppingCartItems)
               .HasForeignKey(sci => sci.ProductItemId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}