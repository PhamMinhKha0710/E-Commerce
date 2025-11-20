using Ecommerce.Application.Commands.Wishlist;
using Ecommerce.Application.Interfaces.Services;
using Ecommerce.Application.Queries.Wishlist;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WishlistController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUserService;

    public WishlistController(IMediator mediator, ICurrentUserService currentUserService)
    {
        _mediator = mediator;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        try
        {
            var userId = _currentUserService.GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "Vui lòng đăng nhập để sử dụng wishlist" });
            }

            var result = await _mediator.Send(new GetUserWishlistQuery { UserId = userId.Value });
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi khi tải danh sách yêu thích", error = ex.Message });
        }
    }

    public class WishlistRequest
    {
        public int ProductId { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> AddToWishlist([FromBody] WishlistRequest request)
    {
        if (request == null || request.ProductId <= 0)
        {
            return BadRequest("ProductId is required");
        }

        var userId = _currentUserService.GetUserId();
        if (!userId.HasValue)
        {
            return Unauthorized("Vui lòng đăng nhập để sử dụng wishlist");
        }

        var result = await _mediator.Send(new AddWishlistItemCommand
        {
            UserId = userId.Value,
            ProductId = request.ProductId
        });

        return Ok(result);
    }

    [HttpDelete("{productId:int}")]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        if (productId <= 0)
        {
            return BadRequest("ProductId is required");
        }

        var userId = _currentUserService.GetUserId();
        if (!userId.HasValue)
        {
            return Unauthorized("Vui lòng đăng nhập để sử dụng wishlist");
        }

        var removed = await _mediator.Send(new RemoveWishlistItemCommand
        {
            UserId = userId.Value,
            ProductId = productId
        });

        if (!removed)
        {
            return NotFound(new { message = "Sản phẩm không tồn tại trong danh sách yêu thích" });
        }

        return NoContent();
    }
}

