using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Order;
using Ecommerce.Application.Queries.Orders;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Application.Command;
using System.Security.Claims;
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
        /// Lấy danh sách đơn hàng của user đang đăng nhập
        /// </summary>
        /// <param name="status">Trạng thái đơn hàng: all, waiting_for_payment, processing, shipping, completed, cancelled</param>
        /// <param name="search">Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm</param>
        /// <param name="page">Số trang (mặc định: 1)</param>
        /// <param name="pageSize">Số lượng đơn hàng mỗi trang (mặc định: 20)</param>
        /// <returns>Danh sách đơn hàng</returns>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<OrdersListDto>> GetOrders(
            [FromQuery] string? status = "all",
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user token");
            }

            var query = new GetOrdersQuery
            {
                UserId = userId,
                Status = status,
                Search = search,
                Page = page,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Lấy chi tiết đơn hàng theo ID
        /// </summary>
        /// <param name="id">ID của đơn hàng</param>
        /// <returns>Chi tiết đơn hàng</returns>
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<OrderResponseDto>> GetOrderById(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user token");
            }

            var query = new GetOrderByIdQuery
            {
                OrderId = id,
                UserId = userId
            };

            var result = await _mediator.Send(query);
            
            if (result == null)
            {
                return NotFound("Order not found or you don't have permission to view this order");
            }

            return Ok(result);
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