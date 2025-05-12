using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class PopularityStatConfiguration : IEntityTypeConfiguration<PopularityStat>
{
    public void Configure(EntityTypeBuilder<PopularityStat> builder)
    {
        // Định nghĩa khóa chính
        builder.HasKey(ps => ps.Id);

        // Cấu hình các thuộc tính
        builder.Property(ps => ps.ProductId)
               .IsRequired();

        builder.Property(ps => ps.CategoryId)
               .IsRequired();

        builder.Property(ps => ps.ViewCount)
               .IsRequired()
               .HasDefaultValue(0);

        builder.Property(ps => ps.PurchaseCount)
               .IsRequired()
               .HasDefaultValue(0);

        builder.Property(ps => ps.TimePeriod)
               .IsRequired()
               .HasColumnType("datetime");

        builder.HasOne(ps => ps.Product)
               .WithMany(x => x.PopularityStats) 
               .HasForeignKey(ps => ps.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ps => ps.ProductCategory)
               .WithMany(x => x.PopularityStats) 
               .HasForeignKey(ps => ps.CategoryId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(ps => ps.ProductId);
        builder.HasIndex(ps => ps.CategoryId);
        builder.HasIndex(ps => ps.TimePeriod);
    }
}