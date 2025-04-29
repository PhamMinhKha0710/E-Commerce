using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("vnpay")]
        public async Task<IActionResult> CreateVnPayPayment([FromBody] VnPaymentRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paymentUrl = await _paymentService.CreatePaymentUrl(HttpContext, request);
            return Ok(new { PaymentUrl = paymentUrl });
        }

        [HttpGet("vnpay/callback")]
        public async Task<IActionResult> VnPayCallback()
        {
            var response = await _paymentService.ProcessPaymentCallback(HttpContext.Request.Query);
            if (!response.Success)
            {
                return BadRequest(new { Message = "Invalid signature" });
            }

            // Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu nếu cần
            // Ví dụ: Gọi repository để cập nhật ShopOrder

            return Ok(response);
        }
    }
}