using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class ProductConfigurationConfiguration : IEntityTypeConfiguration<Domain.Entities.ProductConfiguration>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.ProductConfiguration> builder)
    {
        builder.HasKey(pc => new { pc.ProductItemId, pc.VariationOptionId });

        builder.HasOne(pc => pc.ProductItem)
               .WithMany(pi => pi.ProductConfigurations)
               .HasForeignKey(pc => pc.ProductItemId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pc => pc.VariationOption)
               .WithMany(vo => vo.ProductConfigurations)
               .HasForeignKey(pc => pc.VariationOptionId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}