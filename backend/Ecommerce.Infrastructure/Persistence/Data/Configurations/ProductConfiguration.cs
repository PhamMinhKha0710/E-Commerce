using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
       builder.HasKey(p => p.Id);

       builder.Property(p => p.Name)
              .IsRequired()
              .HasMaxLength(200);
       
       builder.Property(p => p.Slug)
              .IsRequired()
              .HasMaxLength(200);


       builder.Property(p => p.Description)
              .HasColumnType("nvarchar(max)");

       builder.Property(p => p.QtyInStock)
              .IsRequired();

       builder.Property(p => p.Currency)
              .IsRequired()
              .HasMaxLength(3)
              .HasDefaultValue("VND");

       builder.Property(p => p.Rating)
              .IsRequired()
              .HasDefaultValue(0);

       builder.Property(p => p.TotalRatingCount)
              .IsRequired()
              .HasDefaultValue(0);

       builder.Property(p => p.Suggestion)
              .HasMaxLength(500);

       builder.Property(p => p.ElasticsearchId);

       builder.HasOne(p => p.ProductCategory)
              .WithMany(pc => pc.Products)
              .HasForeignKey(p => p.ProductCategoryId)
              .OnDelete(DeleteBehavior.Restrict);

       builder.HasOne(p => p.Brand)
              .WithMany(b => b.Products)
              .HasForeignKey(p => p.BrandId)
              .OnDelete(DeleteBehavior.Restrict);

       builder.HasMany(p => p.ProductItems)
              .WithOne(pi => pi.Product)
              .HasForeignKey(pi => pi.ProductId)
              .OnDelete(DeleteBehavior.Cascade);

       builder.HasMany(p => p.ProductImages)
              .WithOne(pi => pi.Product)
              .HasForeignKey(pi => pi.ProductId)
              .OnDelete(DeleteBehavior.Cascade);

       builder.HasMany(p => p.PopularityStats)
              .WithOne(pi => pi.Product)
              .HasForeignKey(pi => pi.ProductId)
              .OnDelete(DeleteBehavior.Cascade);

       builder.HasMany(p => p.UserViewHistories)
              .WithOne(pi => pi.Product)
              .HasForeignKey(p => p.ProductId)
              .OnDelete(DeleteBehavior.Restrict);

       builder.HasMany(p => p.ProductSimilaritiesAsProduct1)
              .WithOne(ps => ps.Product1)
              .HasForeignKey(ps => ps.ProductId1);

       builder.HasMany(p => p.ProductSimilaritiesAsProduct2)
              .WithOne(ps => ps.Product2)
              .HasForeignKey(ps => ps.ProductId2);


       builder.HasIndex(p => p.Name);
    }
}