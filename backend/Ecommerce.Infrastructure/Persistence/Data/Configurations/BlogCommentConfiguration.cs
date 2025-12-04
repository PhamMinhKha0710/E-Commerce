using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations
{
    public class BlogCommentConfiguration : IEntityTypeConfiguration<BlogComment>
    {
        public void Configure(EntityTypeBuilder<BlogComment> builder)
        {
            builder.ToTable("BlogComments");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.AuthorName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.AuthorEmail)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.Content)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(c => c.IsApproved)
                .HasDefaultValue(false);

            builder.Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Relationships
            builder.HasOne(c => c.BlogPost)
                .WithMany(b => b.Comments)
                .HasForeignKey(c => c.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(c => c.BlogPostId);
        }
    }
}

