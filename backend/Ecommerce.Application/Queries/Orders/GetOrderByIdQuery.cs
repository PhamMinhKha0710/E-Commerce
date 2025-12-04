using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Orders;

public class GetOrderByIdQuery : IRequest<OrderResponseDto?>
{
    public int OrderId { get; set; }
    public int UserId { get; set; } // Để đảm bảo user chỉ xem được đơn hàng của mình
}





