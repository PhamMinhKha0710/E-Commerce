using Ecommerce.Application.Common.DTOs;
using MediatR;
using System.Collections.Generic;

namespace Ecommerce.Application.Commands.Cart;
public class FinalizeCartCommand : IRequest<CartDto>
{
    public int UserId { get; set; }
    public List<CartItemDto> LocalCartItems { get; set; } = new List<CartItemDto>();
}