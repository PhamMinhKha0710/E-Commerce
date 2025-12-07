namespace Ecommerce.Application.Common.DTOs.Order.Admin;

public class AdminOrderStatusHistoryDto
{
    public string Status { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
    public string? ChangedBy { get; set; }
}

































