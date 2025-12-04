using Ecommerce.Application.Queries.Users;
using Ecommerce.Application.Commands.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Route("api/admin/users")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IMediator mediator, ILogger<UsersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // GET: api/admin/users
    [HttpGet]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult> GetUsers(
        [FromQuery] string? keyword = null,
        [FromQuery] string? role = null,
        [FromQuery] string? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetAllUsersQuery
            {
                Keyword = keyword,
                Role = role,
                Status = status,
                Page = page,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users list");
            return StatusCode(500, new { message = "Không thể lấy danh sách người dùng, vui lòng thử lại sau." });
        }
    }

    // GET: api/admin/users/{id}
    [HttpGet("{id}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult> GetUserById(int id)
    {
        try
        {
            var query = new GetUserByIdQuery
            {
                UserId = id
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "User not found: {UserId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user {UserId}", id);
            return StatusCode(500, new { message = "Không thể lấy thông tin người dùng, vui lòng thử lại sau." });
        }
    }

    // PUT: api/admin/users/{id}
    [HttpPut("{id}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult> UpdateUser(int id, [FromBody] Ecommerce.Application.Common.DTOs.User.UpdateUserDto updateDto)
    {
        try
        {
            var command = new Ecommerce.Application.Commands.Users.UpdateUserCommand(id, updateDto);
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(500, new { message = ex.Message });
        }
    }
}













