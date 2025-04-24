using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(u => u.PhoneNumber)
               .IsRequired()
               .HasMaxLength(20);

        builder.Property(u => u.Password)
               .IsRequired()
               .HasMaxLength(256);

        builder.Property(u => u.Role)
               .IsRequired()
               .HasMaxLength(50)
               .HasDefaultValue("User");

        builder.Property(u => u.FirstName)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.LastName)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.AvatarUrl)
               .HasMaxLength(500);

        builder.HasMany(u => u.UserAddresses)
               .WithOne(ua => ua.User)
               .HasForeignKey(ua => ua.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.PaymentMethods)
               .WithOne(upm => upm.User)
               .HasForeignKey(upm => upm.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Reviews)
               .WithOne(ur => ur.User)
               .HasForeignKey(ur => ur.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.ShoppingCarts)
               .WithOne(sc => sc.User)
               .HasForeignKey(sc => sc.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.ShopOrders)
               .WithOne(so => so.User)
               .HasForeignKey(so => so.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.RefreshTokens)
               .WithOne(rt => rt.User)
               .HasForeignKey(rt => rt.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(u => u.Email)
               .IsUnique();
    }
}