using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations
{
    public class BlogCategoryConfiguration : IEntityTypeConfiguration<BlogCategory>
    {
        public void Configure(EntityTypeBuilder<BlogCategory> builder)
        {
            builder.ToTable("BlogCategories");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.Slug)
                .IsRequired()
                .HasMaxLength(200);

            builder.HasIndex(c => c.Slug)
                .IsUnique();

            builder.Property(c => c.Description)
                .HasMaxLength(1000);

            builder.Property(c => c.IsActive)
                .HasDefaultValue(true);

            builder.Property(c => c.DisplayOrder)
                .HasDefaultValue(0);

            builder.Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(c => c.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }
    }
}

