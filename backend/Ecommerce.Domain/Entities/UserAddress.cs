namespace Ecommerce.Domain.Entities;
public class UserAddress
{
    public int UserId { get; set; }
    public User User { get; set; } = new User();
    public int AddressId { get; set; }
    public bool IsDefault { get; set; } = false;
    public Address Address { get; set; } = new Address();
}