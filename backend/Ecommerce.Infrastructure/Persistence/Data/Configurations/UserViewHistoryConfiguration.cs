using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class UserViewHistoryConfiguration : IEntityTypeConfiguration<UserViewHistory> {
    public void Configure(EntityTypeBuilder<UserViewHistory> builder)
        {
            builder.HasKey(uvh => new { uvh.UserId, uvh.ProductId });

            builder.HasOne(u => u.User)
                .WithMany(uvh => uvh.UserViewHistories)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Product)
                .WithMany(uvh => uvh.UserViewHistories)
                .HasForeignKey(p => p.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

        }
}