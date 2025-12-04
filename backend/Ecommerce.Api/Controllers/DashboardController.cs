using Ecommerce.Application.Queries.Dashboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Route("api/admin/dashboard")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IMediator mediator, ILogger<DashboardController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("stats")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult> GetDashboardStats(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var query = new GetDashboardStatsQuery
            {
                StartDate = startDate,
                EndDate = endDate
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard stats");
            return StatusCode(500, new { message = "Không thể lấy thống kê dashboard, vui lòng thử lại sau." });
        }
    }
}














