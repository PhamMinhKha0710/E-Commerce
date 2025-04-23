using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(b => b.ImageUrl)
               .IsRequired()
               .HasMaxLength(500);

        builder.HasMany(b => b.Products)
               .WithOne(p => p.Brand)
               .HasForeignKey(p => p.BrandId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(b => b.Name)
               .IsUnique();
    }
}