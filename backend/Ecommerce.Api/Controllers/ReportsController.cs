using Ecommerce.Application.Queries.Reports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Route("api/admin/reports")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(IMediator mediator, ILogger<ReportsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost("generate")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<IActionResult> GenerateReport(
        [FromBody] GenerateReportRequest request)
    {
        try
        {
            var query = new GenerateReportQuery
            {
                ReportType = request.ReportType,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Format = request.Format
            };

            var result = await _mediator.Send(query);

            if (result.FileContent == null || result.FileContent.Length == 0)
            {
                return BadRequest(new { message = "Không thể tạo báo cáo" });
            }

            // Set Content-Disposition header để browser biết tên file khi download
            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{result.FileName}\"");
            
            return File(result.FileContent, result.ContentType, result.FileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating report");
            return StatusCode(500, new { message = "Không thể tạo báo cáo, vui lòng thử lại sau." });
        }
    }

    [HttpGet("download/{reportId}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<IActionResult> DownloadReport(int reportId)
    {
        // TODO: Implement report storage and retrieval
        return NotFound(new { message = "Báo cáo không tồn tại" });
    }
}

public class GenerateReportRequest
{
    public string ReportType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Format { get; set; } = "csv";
}

