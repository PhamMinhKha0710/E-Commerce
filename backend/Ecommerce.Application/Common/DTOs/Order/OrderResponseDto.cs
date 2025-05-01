namespace Ecommerce.Application.Common.DTOs;
public class OrderResponseDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal OrderTotal { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public string Note { get; set; }
    public string Status { get; set; }
    public AddressDto ShippingAddress { get; set; }
    public List<OrderLineDto> OrderLines { get; set; }
}