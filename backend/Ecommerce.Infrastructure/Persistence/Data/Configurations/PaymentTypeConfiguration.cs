using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations;

public class PaymentTypeConfiguration : IEntityTypeConfiguration<PaymentType>
{
    public void Configure(EntityTypeBuilder<PaymentType> builder)
    {
        builder.HasKey(pt => pt.Id);

        builder.Property(pt => pt.Value)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(pt => pt.Type)
               .IsRequired()
               .HasMaxLength(50);

        builder.HasMany(pt => pt.UserPaymentMethods)
               .WithOne(upm => upm.PaymentType)
               .HasForeignKey(upm => upm.PaymentTypeId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(pt => pt.Value)
               .IsUnique();
    }
}