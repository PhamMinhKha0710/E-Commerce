using Ecommerce.Application.Common.DTOs.Order.Admin;
using MediatR;

namespace Ecommerce.Application.Queries.AdminOrders;

public class GetAdminOrdersQuery : IRequest<AdminOrderListResponseDto>
{
    public string? Keyword { get; set; }
    public string? Status { get; set; }
    public string? PaymentStatus { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}





























































