using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Application.Command;

namespace Ecommerce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaymentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Xử lý callback từ VnPay
        /// </summary>
        /// <returns>Kết quả thanh toán và chuyển hướng</returns>
        [HttpGet("vnpay/callback")]
        [AllowAnonymous] // Cho phép VnPay gọi mà không cần đăng nhập
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> VnPayCallback()
        {
            var command = new ProcessPaymentCallbackCommand { Query = HttpContext.Request.Query };
            var response = await _mediator.Send(command);

            if (response.Success && response.VnPayResponseCode == "00")
            {
                return Redirect("http://localhost:3000/payment/success");
            }
            return Redirect("http://localhost:3000/payment/failure");
        }

        /// <summary>
        /// Thử thanh toán lại cho đơn hàng
        /// </summary>
        /// <param name="orderId">ID của đơn hàng</param>
        /// <returns>Thông tin đơn hàng và URL thanh toán mới</returns>
        [HttpPost("retry-payment/{orderId}")]
        [Authorize] // Yêu cầu đăng nhập
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RetryPayment(int orderId)
        {
            if (orderId <= 0)
                return BadRequest("Invalid order ID.");

            var command = new RetryPaymentCommand { OrderId = orderId };
            var response = await _mediator.Send(command);
            return Ok(response);
        }
    }
}