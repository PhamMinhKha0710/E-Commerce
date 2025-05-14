using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ProductSimilarityConfiguration : IEntityTypeConfiguration<ProductSimilarity>
{
    public void Configure(EntityTypeBuilder<ProductSimilarity> builder)
    {
        builder.HasKey(ps => ps.Id);

        builder.HasOne(ps => ps.Product1)
               .WithMany(p => p.ProductSimilaritiesAsProduct1)
               .HasForeignKey(ps => ps.ProductId1)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ps => ps.Product2)
               .WithMany(p => p.ProductSimilaritiesAsProduct2)
               .HasForeignKey(ps => ps.ProductId2)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(ps => ps.Similarity)
               .IsRequired()
               .HasPrecision(18, 4);

        builder.HasIndex(ps => ps.ProductId2);
        builder.HasIndex(ps => new { ps.ProductId1, ps.ProductId2 });
    }
}