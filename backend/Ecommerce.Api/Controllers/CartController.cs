using Ecommerce.Application.Commands.Cart;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Services;
using Ecommerce.Application.Queries.Cart;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<CartController> _logger;

        public CartController(IMediator mediator, ICurrentUserService currentUserService, ILogger<CartController> logger)
        {
            _mediator = mediator;
            _currentUserService = currentUserService;
            _logger = logger;
        }

        /// <summary>
        /// Lấy thông tin chi tiết về giỏ hàng hiện tại
        /// </summary>
        /// <returns>Thông tin giỏ hàng và các sản phẩm trong giỏ</returns>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCart()
        {
            var userId = _currentUserService.GetUserId();
            _logger.LogInformation($"Trying to get cart for user ID: {userId}");
            
            if (userId == null)
            {
                _logger.LogWarning("User not authenticated");
                return Ok(new CartDto
                {
                    CartItem = new List<CartItemDto>()
                });
            }

            _logger.LogInformation($"Getting cart for user ID: {userId.Value}");
            var query = new GetCartQuery { UserId = userId.Value };
            var result = await _mediator.Send(query);
            
            _logger.LogInformation($"Cart retrieved for user {userId.Value}. Item count: {result.CartItem.Count}");
            return Ok(result.CartItem);
        }

        /// <summary>
        /// Đồng bộ giỏ hàng từ localStorage với server sau khi đăng nhập
        /// </summary>
        [HttpPost("sync")]
        [Authorize]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> SyncCart([FromBody] SyncCartRequestDto request)
        {
            var userId = _currentUserService.GetUserId();
            if (userId == null)
                return Unauthorized();

            var command = new SyncCartCommand
            {
                UserId = userId.Value,
                LocalCartItems = request.LocalCartItems
            };

            var result = await _mediator.Send(command);
            _logger.LogInformation($"Cart synchronized for user {userId.Value}. Item count: {result.CartItem.Count}");
            return Ok(result);
        }

        /// <summary>
        /// Lưu giỏ hàng từ localStorage vào database trước khi thanh toán
        /// </summary>
        [HttpPost("finalize")]
        [Authorize]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> FinalizeCart([FromBody] List<CartItemDto> cartItems)
        {
            var userId = _currentUserService.GetUserId();
            if (userId == null)
                return Unauthorized();

            var command = new FinalizeCartCommand
            {
                UserId = userId.Value,
                LocalCartItems = cartItems
            };

            var result = await _mediator.Send(command);
            _logger.LogInformation($"Cart finalized for user {userId.Value}. Item count: {result.CartItem.Count}");
            return Ok(result);
        }
    }
} 