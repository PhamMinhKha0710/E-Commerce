using Ecommerce.Application.Commands.Reviews;
using Ecommerce.Application.Common.DTOs.Reviews;
using Ecommerce.Application.Queries.Reviews;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReviewsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all reviews with pagination (Admin)
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ReviewsListDto>> GetAllReviews(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetAllReviewsQuery 
            { 
                Page = page, 
                PageSize = pageSize 
            };
            
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get review by ID (Admin)
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ReviewDetailDto>> GetReviewById(int id)
    {
        try
        {
            var query = new GetReviewByIdQuery { ReviewId = id };
            var result = await _mediator.Send(query);
            
            if (result == null)
                return NotFound(new { message = $"Review with ID {id} not found" });
                
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update review status (approve/reject) (Admin)
    /// </summary>
    [HttpPatch("{id}/status")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateReviewStatus(
        int id, 
        [FromBody] UpdateReviewStatusDto dto)
    {
        try
        {
            var command = new UpdateReviewStatusCommand 
            { 
                ReviewId = id, 
                IsStatus = dto.IsStatus 
            };
            
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = $"Review with ID {id} not found" });
                
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a review (Admin)
    /// </summary>
    [HttpDelete("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteReview(int id)
    {
        try
        {
            var command = new DeleteReviewCommand { ReviewId = id };
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = $"Review with ID {id} not found" });
                
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Add admin reply to a review (Admin)
    /// </summary>
    [HttpPost("{id}/admin-reply")]
    [AllowAnonymous]
    public async Task<IActionResult> AddAdminReply(
        int id, 
        [FromBody] CreateReplyDto dto)
    {
        try
        {
            var command = new AddAdminReplyCommand 
            { 
                ReviewId = id, 
                Content = dto.Content 
            };
            
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = $"Review with ID {id} not found" });
                
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update a reply (Admin)
    /// </summary>
    [HttpPut("replies/{replyId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ReviewReplyDto>> UpdateReply(
        int replyId, 
        [FromBody] UpdateReplyDto dto)
    {
        try
        {
            var command = new UpdateReplyCommand 
            { 
                ReplyId = replyId, 
                Content = dto.Content 
            };
            
            var result = await _mediator.Send(command);
            
            if (result == null)
                return NotFound(new { message = $"Reply with ID {replyId} not found" });
                
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a reply (Admin)
    /// </summary>
    [HttpDelete("replies/{replyId}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteReply(int replyId)
    {
        try
        {
            var command = new DeleteReplyCommand { ReplyId = replyId };
            var result = await _mediator.Send(command);
            
            if (!result)
                return NotFound(new { message = $"Reply with ID {replyId} not found" });
                
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}


