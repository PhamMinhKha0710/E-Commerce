namespace Ecommerce.Application.Common;

public class CartPaymentDto {
    public int ProductItemId {get; set;}
    public int? ProductId {get; set;} // Optional: dùng để tìm ProductItem mặc định nếu ProductItemId không hợp lệ
    public int Quantity {get; set;}
    public decimal Price {get; set;}
}