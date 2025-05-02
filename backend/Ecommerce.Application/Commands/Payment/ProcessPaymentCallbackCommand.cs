using Ecommerce.Application.Common.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Ecommerce.Application.Command;

public class ProcessPaymentCallbackCommand : IRequest<VnPaymentResponseDto>
{
    public IQueryCollection Query {get; set;}
}