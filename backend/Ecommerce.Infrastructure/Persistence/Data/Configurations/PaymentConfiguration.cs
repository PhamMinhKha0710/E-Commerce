using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Amount).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(p => p.PaymentStatus).IsRequired().HasMaxLength(50);
        builder.Property(p => p.TransactionId).HasMaxLength(100);
        builder.Property(p => p.ResponseCode).HasMaxLength(50);
        builder.Property(p => p.ResponseMessage).HasMaxLength(500);
        builder.Property(p => p.SecureHash).HasMaxLength(200);
        builder.Property(p => p.CreatedAt).IsRequired();

        builder.HasOne(p => p.ShopOrder)
                .WithMany(o => o.Payments)
                .HasForeignKey(p => p.ShopOrderId)
                .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.PaymentMethod)
               .WithMany(pm => pm.Payments)
               .HasForeignKey(p => p.Id);

        builder.HasMany(p => p.PaymentLogs)
               .WithOne(pl => pl.Payment)
               .HasForeignKey(pl => pl.Id);
    }
}
