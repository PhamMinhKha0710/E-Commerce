namespace Ecommerce.Application.Common.DTOs.Order.Admin;

public class AdminOrderListResponseDto
{
    public IReadOnlyList<AdminOrderListItemDto> Orders { get; set; } = Array.Empty<AdminOrderListItemDto>();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}



































