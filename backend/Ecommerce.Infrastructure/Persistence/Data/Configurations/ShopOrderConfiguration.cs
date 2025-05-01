using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ShopOrderConfiguration : IEntityTypeConfiguration<ShopOrder>
{
    public void Configure(EntityTypeBuilder<ShopOrder> builder)
    {
        builder.HasKey(so => so.Id);

        builder.Property(so => so.OrderNumber)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(so => so.OrderDate)
               .IsRequired();

        builder.Property(so => so.OrderTotal)
               .IsRequired()
               .HasColumnType("decimal(18,2)");

        builder.Property(so => so.ShippingAmount)
               .IsRequired()
               .HasColumnType("decimal(18,2)");

        builder.Property(so => so.DiscountAmount)
               .IsRequired()
               .HasColumnType("decimal(18,2)");

        builder.Property(so => so.Note)
               .HasMaxLength(500);

        builder.HasMany(so => so.Payments)
               .WithOne(p => p.ShopOrder)
               .HasForeignKey(p => p.ShopOrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(so => so.ShippingAddress)
               .WithMany()
               .HasForeignKey(so => so.ShippingAddressId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(so => so.ShippingMethod)
               .WithMany(sm => sm.ShopOrders)
               .HasForeignKey(so => so.ShippingMethodId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(so => so.User)
               .WithMany(u => u.ShopOrders)
               .HasForeignKey(so => so.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(so => so.OrderStatusHistories)
               .WithOne(osh => osh.ShopOrder)
               .HasForeignKey(osh => osh.ShopOrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(so => so.OrderLines)
               .WithOne(Influent => Influent.ShopOrder)
               .HasForeignKey(Influent => Influent.ShopOrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(so => so.OrderNumber)
               .IsUnique();
    }
}