using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class OrderLineConfiguration : IEntityTypeConfiguration<OrderLine>
{
    public void Configure(EntityTypeBuilder<OrderLine> builder)
    {
        builder.HasKey(ol => ol.Id);

        builder.Property(ol => ol.Qty)
               .IsRequired();

        builder.Property(ol => ol.Price)
               .IsRequired()
               .HasColumnType("decimal(18,2)");

        builder.HasOne(ol => ol.ProductItem)
               .WithMany(pi => pi.OrderLines)
               .HasForeignKey(ol => ol.ProductItemId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ol => ol.ShopOrder)
               .WithMany(so => so.OrderLines)
               .HasForeignKey(ol => ol.ShopOrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(ol => ol.UserReviews)
               .WithOne(ur => ur.OrderLine)
               .HasForeignKey(ur => ur.OrderLineId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}