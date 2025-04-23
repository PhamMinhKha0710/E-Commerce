using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class VariationOptionConfiguration : IEntityTypeConfiguration<VariationOption>
{
    public void Configure(EntityTypeBuilder<VariationOption> builder)
    {
        builder.HasKey(vo => vo.Id);

        builder.Property(vo => vo.Value)
               .IsRequired()
               .HasMaxLength(50);

        builder.HasOne(vo => vo.Variation)
               .WithMany(v => v.VariationOptions)
               .HasForeignKey(vo => vo.VariationId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(vo => vo.ProductConfigurations)
               .WithOne(pc => pc.VariationOption)
               .HasForeignKey(pc => pc.VariationOptionId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(vo => vo.Value);
    }
}