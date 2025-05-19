using Ecommerce.Application.Commands.Ratings;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Queries;
using Ecommerce.Application.Queries.Products;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RatingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public RatingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/ratings/product/5
    [HttpGet("product/{productId}")]
    public async Task<ActionResult<ProductRatingDto>> GetProductRating(int productId)
    {
        var query = new GetProductRatingQuery { ProductId = productId };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    // GET: api/ratings/top-rated
    [HttpGet("top-rated")]
    public async Task<ActionResult<ProductsWithRatingListDto>> GetTopRatedProducts(
        [FromQuery] int count = 10, 
        [FromQuery] string category = "")
    {
        var query = new GetProductsWithRatingsQuery
        {
            Page = 1,
            PageSize = count,
            Category = category,
            SortBy = "rating",
            SortDesc = true
        };
        
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    // POST: api/ratings/update/5
    [HttpPost("update/{productId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProductRating(int productId)
    {
        var command = new UpdateProductRatingCommand { ProductId = productId };
        var result = await _mediator.Send(command);
        
        if (!result)
        {
            return NotFound($"Product with ID {productId} not found");
        }
        
        return NoContent();
    }
} 