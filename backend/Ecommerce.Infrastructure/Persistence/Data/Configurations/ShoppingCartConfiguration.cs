using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ShoppingCartConfiguration : IEntityTypeConfiguration<ShoppingCart>
{
    public void Configure(EntityTypeBuilder<ShoppingCart> builder)
    {
        builder.HasKey(sc => sc.Id);

        builder.HasOne(sc => sc.User)
               .WithMany(u => u.ShoppingCarts)
               .HasForeignKey(sc => sc.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(sc => sc.ShoppingCartItems)
               .WithOne(sci => sci.ShoppingCart)
               .HasForeignKey(sci => sci.ShoppingCartId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}