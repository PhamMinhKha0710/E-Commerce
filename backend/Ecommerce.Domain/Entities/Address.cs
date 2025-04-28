namespace Ecommerce.Domain.Entities;
public class Address
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public string AddressLine { get; set; }
    public string Phone { get; set; } 
    public string Note { get; set; } 
    public List<UserAddress> UserAddresses { get; set; }
}