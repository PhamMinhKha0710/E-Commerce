using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ProductItemConfiguration : IEntityTypeConfiguration<ProductItem>
{
    public void Configure(EntityTypeBuilder<ProductItem> builder)
    {
        builder.HasKey(pi => pi.Id);

        builder.Property(pi => pi.QtyInStock)
               .IsRequired();

        builder.Property(pi => pi.OldPrice)
               .IsRequired()
               .HasColumnType("decimal(18,2)");

        builder.Property(pi => pi.Price)
               .IsRequired()
               .HasColumnType("decimal(18,2)");

        builder.Property(pi => pi.SKU)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(pi => pi.ImageUrl)
               .IsRequired()
               .HasMaxLength(500);

        builder.HasOne(pi => pi.Product)
               .WithMany(p => p.ProductItems)
               .HasForeignKey(pi => pi.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(pi => pi.ProductConfigurations)
               .WithOne(pc => pc.ProductItem)
               .HasForeignKey(pc => pc.ProductItemId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(pi => pi.ShoppingCartItems)
               .WithOne(sci => sci.ProductItem)
               .HasForeignKey(sci => sci.ProductItemId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(pi => pi.OrderLines)
               .WithOne(Influent => Influent.ProductItem)
               .HasForeignKey(Influent => Influent.ProductItemId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(pi => pi.SKU)
               .IsUnique();
    }
}