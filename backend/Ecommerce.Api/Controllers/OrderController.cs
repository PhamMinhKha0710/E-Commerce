using Ecommerce.Application.Common.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Application.Command;
using System.Text.Json;

namespace Ecommerce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IMediator mediator, ILogger<OrdersController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Tạo đơn hàng mới và trả về URL thanh toán (nếu có)
        /// </summary>
        /// <param name="request">Thông tin đơn hàng</param>
        /// <returns>Thông tin đơn hàng và URL thanh toán</returns>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
        {
            _logger.LogInformation("Received CreateOrder request: {Request}", JsonSerializer.Serialize(request));
            if (request == null || !request.CartPayments.Any())
                return BadRequest("Invalid order request.");

            var command = new CreateShopOrderCommnad { Request = request };
            var response = await _mediator.Send(command);
            return Ok(response);
        }
    }
}