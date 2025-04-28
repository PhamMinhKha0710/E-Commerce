using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Commands.Cart;
public class SyncCartCommand : IRequest<CartDto>
{
    public int UserId { get; set; }
    public List<CartItemDto> LocalCartItems { get; set; }
}