using Ecommerce.Application.Common.DTOs;
using Microsoft.AspNetCore.Http;

namespace Ecommerce.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentUrl(HttpContext context, VnPaymentRequestDto request);
        Task<VnPaymentResponseDto> ProcessPaymentCallback(IQueryCollection query);
    }
}