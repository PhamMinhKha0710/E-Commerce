using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ProductCategoryConfiguration : IEntityTypeConfiguration<ProductCategory>
{
    public void Configure(EntityTypeBuilder<ProductCategory> builder)
    {
        builder.HasKey(pc => pc.Id);

        builder.Property(pc => pc.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.HasOne(pc => pc.Parent)
               .WithMany(pc => pc.Children)
               .HasForeignKey(pc => pc.ParentId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(pc => pc.Products)
               .WithOne(p => p.ProductCategory)
               .HasForeignKey(p => p.ProductCategoryId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(pc => pc.PromotionCategories)
               .WithOne(pc => pc.ProductCategory)
               .HasForeignKey(pc => pc.ProductCategoryId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(pc => pc.Name);
    }
}