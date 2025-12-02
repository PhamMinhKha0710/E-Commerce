namespace Ecommerce.Application.Common.DTOs.Order.Admin;

public class AdminUpdateOrderStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? AdminNote { get; set; }
    public bool NotifyCustomer { get; set; } = false;
}













