namespace Ecommerce.Application.Common.DTOs;

public class CreateOrderResponseDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; }
    public string PaymentUrl { get; set; }
}