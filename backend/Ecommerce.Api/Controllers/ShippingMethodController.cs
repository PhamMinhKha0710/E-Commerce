using Ecommerce.Application.Common;
using Ecommerce.Application.Queries;
using Ecommerce.Application.Queries.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShippingMethodController : ControllerBase
{

    private readonly IMediator _mediator;
    public ShippingMethodController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("GetAll")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllShippingMethod()
    {
        var queries = new GetAllShippingMethodQueries();

        var response = await _mediator.Send(queries);

        return Ok(response);
    }
}