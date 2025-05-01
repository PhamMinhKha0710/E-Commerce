using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PaymentLogConfiguration : IEntityTypeConfiguration<PaymentLog>
{
    public void Configure(EntityTypeBuilder<PaymentLog> builder)
    {
        builder.HasKey(pl => pl.Id);
        builder.Property(pl => pl.EventType).IsRequired().HasMaxLength(50);
        builder.Property(pl => pl.Message).IsRequired().HasMaxLength(500);
        builder.Property(pl => pl.Data);
        builder.Property(pl => pl.CreatedAt).IsRequired();

        builder.HasOne(pl => pl.Payment)
               .WithMany(p => p.PaymentLogs)
               .HasForeignKey(pl => pl.PaymentId);
    }
}
