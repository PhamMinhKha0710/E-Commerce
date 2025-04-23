using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class UserReviewConfiguration : IEntityTypeConfiguration<UserReview>
{
    public void Configure(EntityTypeBuilder<UserReview> builder)
    {
        builder.HasKey(ur => ur.Id);

        builder.Property(ur => ur.RatingValue)
               .IsRequired();

        builder.Property(ur => ur.Comment)
               .HasMaxLength(1000);

        builder.Property(ur => ur.Created)
               .IsRequired();

        builder.HasOne(ur => ur.User)
               .WithMany(u => u.Reviews)
               .HasForeignKey(ur => ur.UserId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ur => ur.OrderLine)
               .WithMany(Influent => Influent.UserReviews)
               .HasForeignKey(ur => ur.OrderLineId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}