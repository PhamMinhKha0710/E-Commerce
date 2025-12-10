using Ecommerce.Application.Commands.Brands;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Queries.Brands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Route("api/admin/brands")]
[ApiController]

public class BrandsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BrandsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    // [Authorize(Roles = "Admin")]
    [AllowAnonymous]
    public async Task<ActionResult<List<BrandDto>>> GetAllBrands()
    {
        try
        {
            var brands = await _mediator.Send(new GetAllBrandsQuery());
            return Ok(brands);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    // [Authorize(Roles = "Admin")]
    [AllowAnonymous]
    public async Task<ActionResult<BrandDto>> GetBrandById(int id)
    {
        try
        {
            var brand = await _mediator.Send(new GetBrandByIdQuery(id));
            return Ok(brand);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    // [Authorize(Roles = "Admin")]
    [AllowAnonymous]
    public async Task<ActionResult<BrandDto>> CreateBrand(CreateBrandDto createBrandDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { 
                message = "Dữ liệu không hợp lệ",
                errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
            });
        }

        try
        {
            var brand = await _mediator.Send(new CreateBrandCommand(createBrandDto));
            return CreatedAtAction(nameof(GetBrandById), new { id = brand.Id }, brand);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    // [Authorize(Roles = "Admin")]
    [AllowAnonymous]
    public async Task<ActionResult<BrandDto>> UpdateBrand(int id, UpdateBrandDto updateBrandDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { 
                message = "Dữ liệu không hợp lệ",
                errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
            });
        }

        try
        {
            var brand = await _mediator.Send(new UpdateBrandCommand(id, updateBrandDto));
            return Ok(brand);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    //[Authorize(Roles = "Admin")]
    [AllowAnonymous]
    public async Task<ActionResult> DeleteBrand(int id)
    {
        try
        {
            var result = await _mediator.Send(new DeleteBrandCommand(id));
            if (result)
            {
                return NoContent();
            }
            return NotFound(new { message = $"Không tìm thấy thương hiệu với ID {id}" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
} 