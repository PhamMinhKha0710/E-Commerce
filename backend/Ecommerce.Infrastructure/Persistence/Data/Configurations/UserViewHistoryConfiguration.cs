using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class UserViewHistoryConfiguration : IEntityTypeConfiguration<UserViewHistory> {
    public void Configure(EntityTypeBuilder<UserViewHistory> builder)
        {
            builder.HasKey(uvh => uvh.Id);
            
            builder.Property(uvh => uvh.UserId).IsRequired();
            builder.Property(uvh => uvh.ProductId).IsRequired();

            builder.Property(uvh => uvh.ViewTime)
                   .IsRequired();
            
            builder.HasOne(u => u.User)
                .WithMany(uvh => uvh.UserViewHistories)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Product)
                .WithMany(uvh => uvh.UserViewHistories)
                .HasForeignKey(p => p.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(uvh => uvh.UserId);
            builder.HasIndex(uvh => uvh.ProductId);
            builder.HasIndex(uvh => uvh.ViewTime);
        }
}