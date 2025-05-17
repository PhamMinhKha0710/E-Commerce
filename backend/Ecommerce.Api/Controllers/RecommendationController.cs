// Ecommerce.Api/Controllers/RecommendationsController.cs
using Ecommerce.Application.Queries;
using Ecommerce.Application.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class RecommendationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<RecommendationsController> _logger;

    public RecommendationsController(IMediator mediator, ILogger<RecommendationsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("recommend")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecommendations([FromQuery] int? productId, [FromQuery] int? categoryId, [FromQuery] int limit = 6)
    {
        _logger.LogInformation("Fetching recommendations for productId: {ProductId}, categoryId: {CategoryId}, limit: {Limit}", productId, categoryId, limit);
        var query = new GetRecommendationsQuery
        {
            ProductId = productId,
            CategoryId = categoryId,
            Limit = limit
        };

        var products = await _mediator.Send(query);
        return Ok(products);
    }

    [HttpPost("update-similarities")]
    // [Authorize(Roles = "Admin")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateSimilarities([FromServices] ProductSimilarityService productSimilarityService)
    {
        await productSimilarityService.UpdateSimilaritiesAsync();
        return Ok();
    }
}