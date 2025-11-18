namespace Ecommerce.Application.Common.DTOs.Profile;

public class ProfileAddressDto
{
    public int AddressId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}

