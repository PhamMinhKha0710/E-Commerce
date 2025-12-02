namespace Ecommerce.Application.Common.DTOs.Order;

public class OrdersListDto
{
    public List<OrderListItemDto> Orders { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}





