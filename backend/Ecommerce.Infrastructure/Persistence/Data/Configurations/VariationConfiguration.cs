using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class VariationConfiguration : IEntityTypeConfiguration<Variation>
{
    public void Configure(EntityTypeBuilder<Variation> builder)
    {
        builder.HasKey(v => v.Id);

        builder.Property(v => v.Value)
               .IsRequired()
               .HasMaxLength(50);

        builder.HasMany(v => v.VariationOptions)
               .WithOne(vo => vo.Variation)
               .HasForeignKey(vo => vo.VariationId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(v => v.Value)
               .IsUnique();
    }
}