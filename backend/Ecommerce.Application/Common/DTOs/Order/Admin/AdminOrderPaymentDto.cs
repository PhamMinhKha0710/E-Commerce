namespace Ecommerce.Application.Common.DTOs.Order.Admin;

public class AdminOrderPaymentDto
{
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
}


















