using Ecommerce.Application.Commands;
using Ecommerce.Application.Commands.Promotions;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Promotion;
using Ecommerce.Application.Queries;
using Ecommerce.Application.Queries.Promotions;
using Ecommerce.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;


[ApiController]
[Route("api/admin/[controller]")]

public class PromotionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PromotionsController> _logger;
    
    public PromotionsController(IMediator mediator, ILogger<PromotionsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("client/{code}")]
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

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<PromotionDto>>> GetAllPromotions()
    {
        try
        {
            var result = await _mediator.Send(new GetAllPromotionsQuery());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<PromotionDto>> GetPromotionById(int id)
    {
        try
        {
            var result = await _mediator.Send(new GetPromotionByIdQuery(id));
            if (result == null)
                return NotFound();
                
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] Ecommerce.Application.Common.DTOs.Promotion.CreatePromotionDto dto)
    {
        try
        {
            var result = await _mediator.Send(new CreatePromotionCommand(dto));
            return CreatedAtAction(nameof(GetPromotionById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<PromotionDto>> UpdatePromotion(int id, [FromBody] UpdatePromotionDto dto)
    {
        _logger.LogInformation("Received update request for promotion {PromotionId}", id);
        _logger.LogInformation("DTO: Name={Name}, Code={Code}, Discount={Discount}, Start={Start}, End={End}, Active={Active}, TotalQty={TotalQty}", 
            dto.Name, dto.Code, dto.DiscountRate, dto.StartDate, dto.EndDate, dto.IsActive, dto.TotalQuantity);
        
        if (id != dto.Id)
        {
            _logger.LogWarning("ID mismatch: route={RouteId}, body={BodyId}", id, dto.Id);
            return BadRequest("ID in route does not match ID in request body");
        }
            
        try
        {
            _logger.LogInformation("Updating promotion {PromotionId}", id);
            var result = await _mediator.Send(new UpdatePromotionCommand(dto));
            _logger.LogInformation("Promotion {PromotionId} updated successfully", id);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Validation error updating promotion {PromotionId}: {Error}", id, ex.Message);
            
            if (ex.Message.Contains("Không tìm thấy"))
                return NotFound(ex.Message);
                
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating promotion {PromotionId}", id);
            return BadRequest(ex.Message);
        }
    }


    [HttpDelete("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult> DeletePromotion(int id)
    {
        try
        {
            var result = await _mediator.Send(new DeletePromotionCommand(id));
            if (!result)
                return NotFound($"Không tìm thấy khuyến mãi với ID: {id}");
                
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<ActionResult<List<CategoryDto>>> GetCategoriesForPromotion()
    {
        try
        {
            var result = await _mediator.Send(new GetCategoriesForPromotionQuery());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("check/{code}")]
    [AllowAnonymous]
    public async Task<ActionResult<bool>> CheckPromotionAvailability(string code)
    {
        try
        {
            var result = await _mediator.Send(new CheckPromotionAvailabilityQuery(code));
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id}/use")]
    [AllowAnonymous]
    public async Task<ActionResult<bool>> IncrementPromotionUsage(int id)
    {
        try
        {
            var result = await _mediator.Send(new IncrementPromotionUsageCommand(id));
            if (!result)
                return NotFound($"Không tìm thấy khuyến mãi với ID: {id} hoặc đã hết lượt sử dụng");
                
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}