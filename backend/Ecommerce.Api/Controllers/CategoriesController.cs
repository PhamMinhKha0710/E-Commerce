using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Queries;
using Ecommerce.Application.Queries.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllCategories()
    {
        var query = new GetAllCategoriesQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}/subcategories")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSubCategories(int id)
    {   
        var query = new GetSubCategoriesQuery { CategoryId = id};
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("/AdminCategories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategories()
    {
        var query = new GetProductCategoriesQuery();
        var categories = await _mediator.Send(query);
        return Ok(categories);
    }
}