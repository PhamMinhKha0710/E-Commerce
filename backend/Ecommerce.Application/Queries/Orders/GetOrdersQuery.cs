using Ecommerce.Application.Common.DTOs.Order;
using MediatR;

namespace Ecommerce.Application.Queries.Orders;

public class GetOrdersQuery : IRequest<OrdersListDto>
{
    public int UserId { get; set; }
    public string? Status { get; set; } // all, waiting_for_payment, processing, shipping, completed, cancelled
    public string? Search { get; set; } // Tìm theo mã đơn hàng hoặc tên sản phẩm
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}





