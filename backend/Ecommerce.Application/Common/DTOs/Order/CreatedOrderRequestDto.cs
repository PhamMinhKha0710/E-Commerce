namespace Ecommerce.Application.Common.DTOs;

public class CreateOrderRequestDto
{
    public int ShippingMethodId { get; set; }
    public string Note { get; set; }
    public string PaymentMethod { get; set; } 
    public List<CartPaymentDto> CartPayments { get; set; }
}