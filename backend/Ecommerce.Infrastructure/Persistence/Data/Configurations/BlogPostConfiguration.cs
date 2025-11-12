using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations
{
    public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
    {
        public void Configure(EntityTypeBuilder<BlogPost> builder)
        {
            builder.ToTable("BlogPosts");

            builder.HasKey(b => b.Id);

            builder.Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(b => b.Slug)
                .IsRequired()
                .HasMaxLength(500);

            builder.HasIndex(b => b.Slug)
                .IsUnique();

            builder.Property(b => b.Excerpt)
                .HasMaxLength(1000);

            builder.Property(b => b.Content)
                .IsRequired();

            builder.Property(b => b.FeaturedImage)
                .HasMaxLength(500);

            builder.Property(b => b.Author)
                .HasMaxLength(200);

            builder.Property(b => b.Category)
                .HasMaxLength(100);

            builder.Property(b => b.Tags)
                .HasMaxLength(500);

            builder.Property(b => b.MetaTitle)
                .HasMaxLength(500);

            builder.Property(b => b.MetaDescription)
                .HasMaxLength(1000);

            builder.Property(b => b.MetaKeywords)
                .HasMaxLength(500);

            builder.Property(b => b.IsPublished)
                .HasDefaultValue(false);

            builder.Property(b => b.IsHighlighted)
                .HasDefaultValue(false);

            builder.Property(b => b.ViewCount)
                .HasDefaultValue(0);

            builder.Property(b => b.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(b => b.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Relationships
            builder.HasMany(b => b.Comments)
                .WithOne(c => c.BlogPost)
                .HasForeignKey(c => c.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

