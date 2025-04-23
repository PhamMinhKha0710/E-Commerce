using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class UserPaymentMethodConfiguration : IEntityTypeConfiguration<UserPaymentMethod>
{
    public void Configure(EntityTypeBuilder<UserPaymentMethod> builder)
    {
        builder.HasKey(upm => upm.Id);

        builder.Property(upm => upm.AccountNumber)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(upm => upm.ExpiryDate)
               .IsRequired();

        builder.HasOne(upm => upm.User)
               .WithMany(u => u.PaymentMethods)
               .HasForeignKey(upm => upm.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(upm => upm.PaymentType)
               .WithMany(pt => pt.UserPaymentMethods)
               .HasForeignKey(upm => upm.PaymentTypeId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(upm => upm.ShopOrders)
               .WithOne(so => so.PaymentMethod)
               .HasForeignKey(so => so.PaymentMethodId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}