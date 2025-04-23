using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class OrderStatusHistoryConfiguration : IEntityTypeConfiguration<OrderStatusHistory>
{
    public void Configure(EntityTypeBuilder<OrderStatusHistory> builder)
    {
        builder.HasKey(osh => osh.Id);

        builder.HasOne(osh => osh.OrderStatus)
               .WithMany(os => os.OrderStatusHistories)
               .HasForeignKey(osh => osh.OrderStatusId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(osh => osh.ShopOrder)
               .WithMany(so => so.OrderStatusHistories)
               .HasForeignKey(osh => osh.ShopOrderId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}