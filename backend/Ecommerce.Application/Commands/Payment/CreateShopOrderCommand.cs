using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Command;

public class CreateShopOrderCommnad : IRequest<CreateOrderResponseDto>
{
    public CreateOrderRequestDto Request {get; set;}
}