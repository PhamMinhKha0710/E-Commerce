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
              .HasMaxLength(1000);

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

       builder.Property(p => p.ImageEmbedding)
              .HasColumnName("ImageEmbedding")
              .HasColumnType("VARBINARY(MAX)");

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

       builder.HasIndex(p => p.Name);
    }
}