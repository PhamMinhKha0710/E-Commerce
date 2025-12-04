using Ecommerce.Application.Common.DTOs.Order.Admin;
using MediatR;

namespace Ecommerce.Application.Queries.AdminOrders;

public class GetAdminOrderDetailQuery : IRequest<AdminOrderDetailDto>
{
    public int OrderId { get; set; }
}



















