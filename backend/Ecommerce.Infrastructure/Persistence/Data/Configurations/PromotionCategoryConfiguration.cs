using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class PromotionCategoryConfiguration : IEntityTypeConfiguration<PromotionCategory>
{
    public void Configure(EntityTypeBuilder<PromotionCategory> builder)
    {
        builder.HasKey(pc => new { pc.PromotionId, pc.ProductCategoryId });

        builder.HasOne(pc => pc.Promotion)
               .WithMany(p => p.PromotionCategories)
               .HasForeignKey(pc => pc.PromotionId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pc => pc.ProductCategory)
               .WithMany(pc => pc.PromotionCategories)
               .HasForeignKey(pc => pc.ProductCategoryId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}