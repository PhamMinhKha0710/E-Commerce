using Ecommerce.Application.Queries;
using Ecommerce.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;


[ApiController]
[Route("api/[controller]")]

public class PromotionController : ControllerBase
{
    private readonly IMediator _mediator;
    public PromotionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{code}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPromotionByCodeClient(string code)
    {
        try
        {
            var query = new GetPromotionByCodeQuery { code = code };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Có lỗi xảy ra ở backend {ex}");
        }
    }
}