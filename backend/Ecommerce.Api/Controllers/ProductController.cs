using Ecommerce.Application.Command;
using Ecommerce.Application.Commands.ProductCommands;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Queries.Products;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<ProductsWithRatingListDto>> GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string category = "",
        [FromQuery] string brand = "",
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] string sortBy = "rating",
        [FromQuery] bool sortDesc = true)
    {
        var query = new GetProductsWithRatingsQuery
        {
            Page = page,
            PageSize = pageSize,
            Category = category,
            Brand = brand,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            SortBy = sortBy,
            SortDesc = sortDesc
        };
        
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    // GET: api/products/{id}/detail
    [HttpGet("{id}/detail")]
    public async Task<IActionResult> GetProductDetail(int id)
    {
        var query = new GetProductDetailQuery { Id = id };
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound("Product not found");
        }

        return Ok(result);
    }

    // GET: api/products/{id}/variant-combinations
    [HttpGet("{id}/variant-combinations")]
    public async Task<IActionResult> GetVariantCombinations(int id)
    {
        var query = new GetVariantCombinationsQuery { ProductId = id };
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPost("{productId}/sync")]
    [AllowAnonymous]
    public async Task<IActionResult> SyncProduct(int productId, [FromBody] string action)
    {
        if (!new[] { "add", "update", "delete" }.Contains(action))
            return BadRequest(new { Message = "Invalid action" });

        var command = new SyncProductCommand { ProductId = productId, Action = action };
        await _mediator.Send(command);
        return Ok(new { Message = "Product sync message sent to queue" });
    }

    [HttpPost("update-elasticsearch-id")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateElasticsearchId([FromBody] UpdateElasticsearchIdCommand command)
    {
        await _mediator.Send(command);
        return Ok(new { Message = "ElasticsearchId updated" });
    }
}