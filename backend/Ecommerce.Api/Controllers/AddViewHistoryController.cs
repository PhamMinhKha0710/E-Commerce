// Ecommerce.Api/Controllers/ViewHistoryController.cs
using Ecommerce.Application.Commands;
using Ecommerce.Application.Commands.ViewHistory;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ViewHistoryController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ViewHistoryController> _logger;

    public ViewHistoryController(IMediator mediator, ILogger<ViewHistoryController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost]
    [Authorize] // Yêu cầu đăng nhập
    public async Task<IActionResult> AddViewHistory([FromBody] AddViewHistoryRequest request)
    {
        _logger.LogInformation("Adding view history for productId: {ProductId}", request.ProductId);
        var command = new AddViewHistoryCommand
        {
            ProductId = request.ProductId
        };

        var result = await _mediator.Send(command);
        return result ? Ok() : BadRequest("Failed to add view history");
    }

    [HttpPost("cleanup")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CleanupViewHistory()
    {
        _logger.LogInformation("Cleaning up old view history");
        var command = new CleanupViewHistoryCommand();
        var result = await _mediator.Send(command);
        return result ? Ok() : BadRequest("Failed to clean up view history");
    }
}

public class AddViewHistoryRequest
{
    public int ProductId { get; set; } // Bỏ UserId
}