namespace Ecommerce.Application.Common;

public class CartPaymentDto {
    public int ProductItemId {get; set;}
    public int Quantity {get; set;}
    public decimal Price {get; set;}
}