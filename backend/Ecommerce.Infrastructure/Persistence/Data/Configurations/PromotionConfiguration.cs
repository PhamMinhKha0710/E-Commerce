using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;
using Azure.Core.Pipeline;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class PromotionConfiguration : IEntityTypeConfiguration<Promotion>
{
       public void Configure(EntityTypeBuilder<Promotion> builder)
       {
              builder.HasKey(p => p.Id);

              builder.Property(p => p.Name)
                     .IsRequired()
                     .HasMaxLength(100);

              builder.Property(p => p.Code)
                     .IsRequired()
                     .HasMaxLength(50);

              builder.Property(p => p.Description)
                     .HasMaxLength(500);

              builder.Property(p => p.DiscountRate)
                     .IsRequired()
                     .HasColumnType("decimal(5,2)");

              builder.Property(p => p.StartDate)
                     .IsRequired();

              builder.Property(p => p.EndDate)
                     .IsRequired();


              builder.HasMany(p => p.PromotionCategories)
                     .WithOne(pc => pc.Promotion)
                     .HasForeignKey(pc => pc.PromotionId)
                     .OnDelete(DeleteBehavior.Cascade);

              builder.HasMany(p => p.ShopOrders)
                     .WithOne(so => so.Promotion)
                     .OnDelete(DeleteBehavior.Cascade);

              builder.HasIndex(p => p.Code)
                     .IsUnique();
       }
}