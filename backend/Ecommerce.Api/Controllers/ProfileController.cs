using Ecommerce.Application.Queries.Profile;
using Ecommerce.Application.Commands.Users;
using Ecommerce.Application.Common.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(IMediator mediator, ILogger<ProfileController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new { error = "Không xác định được người dùng từ token" });
        }

        try
        {
            var response = await _mediator.Send(new GetUserProfileOverviewQuery { UserId = userId });
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Không tìm thấy thông tin người dùng {UserId}", userId);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông tin hồ sơ cho user {UserId}", userId);
            return StatusCode(500, new { error = "Không thể tải thông tin hồ sơ, vui lòng thử lại sau." });
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto updateDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new { error = "Không xác định được người dùng từ token" });
        }

        try
        {
            var command = new UpdateUserCommand(userId, updateDto);
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi cập nhật thông tin hồ sơ cho user {UserId}", userId);
            return StatusCode(500, new { error = "Không thể cập nhật thông tin hồ sơ, vui lòng thử lại sau." });
        }
    }
}

