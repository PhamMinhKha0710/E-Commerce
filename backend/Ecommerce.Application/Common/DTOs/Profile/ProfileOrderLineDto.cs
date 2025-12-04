namespace Ecommerce.Application.Common.DTOs.Profile;

public class ProfileOrderLineDto
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
    public string? ImageUrl { get; set; }
}

