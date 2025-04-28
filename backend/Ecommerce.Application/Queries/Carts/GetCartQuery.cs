using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Cart;
public class GetCartQuery : IRequest<CartDto>
{
    public int UserId { get; set; }
}