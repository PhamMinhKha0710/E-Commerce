using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ShippingMethodConfiguration : IEntityTypeConfiguration<ShippingMethod>
{
    public void Configure(EntityTypeBuilder<ShippingMethod> builder)
    {
        builder.HasKey(sm => sm.Id);

        builder.Property(sm => sm.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.HasMany(sm => sm.ShopOrders)
               .WithOne(so => so.ShippingMethod)
               .HasForeignKey(so => so.ShippingMethodId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(sm => sm.Name)
               .IsUnique();
    }
}