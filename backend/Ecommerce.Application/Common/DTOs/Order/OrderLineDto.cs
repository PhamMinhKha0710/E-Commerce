namespace Ecommerce.Application.Common.DTOs;
public class OrderLineDto
{
    public int Id { get; set; }
    public int ProductItemId { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}