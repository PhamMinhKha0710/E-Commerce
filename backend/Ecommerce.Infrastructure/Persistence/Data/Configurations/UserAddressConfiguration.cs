using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class UserAddressConfiguration : IEntityTypeConfiguration<UserAddress>
{
    public void Configure(EntityTypeBuilder<UserAddress> builder)
    {
        builder.HasKey(ua => new { ua.UserId, ua.AddressId });

        builder.HasOne(ua => ua.User)
               .WithMany(u => u.UserAddresses)
               .HasForeignKey(ua => ua.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ua => ua.Address)
               .WithMany()
               .HasForeignKey(ua => ua.AddressId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}