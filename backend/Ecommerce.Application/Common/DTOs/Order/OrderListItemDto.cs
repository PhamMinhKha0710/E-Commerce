namespace Ecommerce.Application.Common.DTOs.Order;

public class OrderListItemDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal OrderTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public string StatusDisplay { get; set; } = string.Empty; // Hiển thị tiếng Việt
    public List<OrderItemDto> Items { get; set; } = new();
}
