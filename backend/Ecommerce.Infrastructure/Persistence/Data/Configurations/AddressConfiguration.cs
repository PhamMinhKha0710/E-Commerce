using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        // Định nghĩa khóa chính
        builder.HasKey(a => a.Id);

        // Cấu hình các thuộc tính
        builder.Property(a => a.Name).IsRequired().HasMaxLength(100);
        builder.Property(a => a.AddressLine).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Phone).IsRequired().HasMaxLength(20); 
        builder.Property(a => a.Note).HasMaxLength(500); 


        // Mối quan hệ với UserAddress
        builder.HasMany(a => a.UserAddresses)
               .WithOne(ua => ua.Address)
               .HasForeignKey(ua => ua.AddressId)
               .OnDelete(DeleteBehavior.Cascade); 
    }
}