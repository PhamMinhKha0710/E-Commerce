using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class OrderStatusConfiguration : IEntityTypeConfiguration<OrderStatus>
{
    public void Configure(EntityTypeBuilder<OrderStatus> builder)
    {
        builder.HasKey(os => os.Id);

        builder.Property(os => os.Status)
               .IsRequired()
               .HasMaxLength(50);

        builder.HasMany(os => os.OrderStatusHistories)
               .WithOne(osh => osh.OrderStatus)
               .HasForeignKey(osh => osh.OrderStatusId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(os => os.Status)
               .IsUnique();
    }
}