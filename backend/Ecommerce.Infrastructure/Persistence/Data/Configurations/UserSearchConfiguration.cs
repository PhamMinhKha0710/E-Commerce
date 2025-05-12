using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Entitie;

namespace Ecommerce.Infrastructure.Persistence.Data.Configurations
{
    public class UserSearchConfiguration : IEntityTypeConfiguration<UserSearch>
    {
        public void Configure(EntityTypeBuilder<UserSearch> builder)
        {
            builder.HasKey(us => us.Id);

            builder.Property(us => us.keyWord)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(us => us.SearchTime)
                   .IsRequired()
                   .HasColumnType("datetime");

            builder.Property(us => us.UserId)
                   .IsRequired();

            builder.HasOne(us => us.User)
                   .WithMany()  
                   .HasForeignKey(us => us.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(us => us.UserId);
            builder.HasIndex(us => us.SearchTime);
            builder.HasIndex(us => us.keyWord);
        }
    }
}