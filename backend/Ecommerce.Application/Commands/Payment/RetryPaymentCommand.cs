using Ecommerce.Application.Common.DTOs;
using MediatR;

public class RetryPaymentCommand : IRequest<CreateOrderResponseDto>
{
    public int OrderId { get; set; }
}