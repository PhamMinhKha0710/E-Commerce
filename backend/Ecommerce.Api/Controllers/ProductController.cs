using Ecommerce.Application.Queries.Products;
using MediatR;
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
}