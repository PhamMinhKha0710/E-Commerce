using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PaymentMethodConfiguration : IEntityTypeConfiguration<PaymentMethod>
{
    public void Configure(EntityTypeBuilder<PaymentMethod> builder)
    {
        builder.HasKey(pm => pm.Id);
        builder.Property(pm => pm.Name).IsRequired().HasMaxLength(50);
        builder.Property(pm => pm.Description).HasMaxLength(200);
        builder.Property(pm => pm.IsActive).IsRequired();
        builder.Property(pm => pm.CreatedAt).IsRequired();

        builder.HasMany(pm => pm.Payments)
               .WithOne(p => p.PaymentMethod)
               .HasForeignKey(p => p.PaymentMethodId);
    }
}
