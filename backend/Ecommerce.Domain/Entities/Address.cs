namespace Ecommerce.Domain.Entities;
public class Address
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public List<UserAddress> UserAddresses { get; set; } = new List<UserAddress>();
}