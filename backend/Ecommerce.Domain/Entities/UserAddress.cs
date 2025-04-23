namespace Ecommerce.Domain.Entities;
public class UserAddress
{
    public int UserId { get; set; }
    public User User { get; set; }
    public int AddressId { get; set; }
    public bool IsDefault { get; set; } = false;
    public Address Address { get; set; }
}