using Ecommerce.Application.Commands.Products;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Product;
using Ecommerce.Application.Queries.Products;
using Ecommerce.Infrastructure.Elasticsearch;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[Route("api/admin/products")]
[ApiController]
public class AdminProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IElasticsearchService _elasticsearchService;

    public AdminProductsController(IMediator mediator, IElasticsearchService elasticsearchService)
    {
        _mediator = mediator;
        _elasticsearchService = elasticsearchService;
    }

    // GET: api/admin/products
    [HttpGet]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult<AdminProductListResponse>> GetProducts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] int? categoryId = null,
        [FromQuery] int? brandId = null,
        [FromQuery] string? status = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null)
    {
        try
        {
            // If searchTerm is provided, use Elasticsearch
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var searchRequest = new ProductSearchRequestDto
                {
                    Query = searchTerm,
                    Page = pageNumber,
                    PageSize = pageSize,
                    Sort = sortBy
                };

                var searchResult = await _elasticsearchService.SearchProductsAsync(searchRequest);
                
                // Map Elasticsearch results to AdminProductListResponse
                var adminProducts = searchResult.Results.Select(r => new AdminProductListItemDto
                {
                    Id = r.ProductId,
                    Name = r.Name,
                    Slug = "", // Will need to fetch from database if needed
                    SKU = r.Sku,
                    Price = (decimal)r.Price,
                    SalePrice = r.OldPrice.HasValue ? (decimal)r.OldPrice.Value : 0,
                    Stock = r.Stock,
                    Status = r.Stock > 0 ? "In Stock" : "Out of Stock",
                    CategoryId = 0, // Will need to fetch from database if needed
                    CategoryName = r.Category,
                    BrandId = 0, // Will need to fetch from database if needed
                    BrandName = r.Brand,
                    HasVariants = r.HasVariation,
                    ImageUrl = r.ImageUrl
                }).ToList();

                return Ok(new AdminProductListResponse
                {
                    Products = adminProducts,
                    Categories = new List<string>(), // Can be populated if needed
                    Brands = new List<string>(), // Can be populated if needed
                    TotalCount = (int)searchResult.Total,
                    PageNumber = searchResult.Page,
                    PageSize = searchResult.PageSize,
                    TotalPages = (int)Math.Ceiling(searchResult.Total / (double)searchResult.PageSize)
                });
            }

            // Otherwise, use regular database query
            var query = new GetAdminProductsQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortBy = sortBy,
                CategoryId = categoryId,
                BrandId = brandId,
                Status = status,
                MinPrice = minPrice,
                MaxPrice = maxPrice
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // GET: api/admin/products/{id}
    [HttpGet("{id}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult<AdminProductDto>> GetProductById(int id)
    {
        try
        {
            var query = new GetAdminProductDetailQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // POST: api/admin/products
    [HttpPost]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult<AdminProductDto>> CreateProduct(CreateUpdateProductDto productDto)
    {
        try
        {
            var command = new CreateProductCommand(productDto);
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProductById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/admin/products/{id}
    [HttpPut("{id}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult<AdminProductDto>> UpdateProduct(int id, CreateUpdateProductDto productDto)
    {
        try
        {
            var command = new UpdateProductCommand(id, productDto);
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE: api/admin/products/{id}
    [HttpDelete("{id}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult> DeleteProduct(int id)
    {
        try
        {
            var command = new DeleteProductCommand(id);
            var result = await _mediator.Send(command);
            
            if (result)
            {
                return NoContent();
            }
            
            return NotFound(new { message = $"Không tìm thấy sản phẩm với ID {id}" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST: api/admin/products/{id}/variants
    [HttpPost("{id}/variants")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult<ProductVariantDetailsDto>> CreateProductVariant(int id, CreateProductVariantDto variantDto)
    {
        try
        {
            var command = new CreateProductVariantCommand(id, variantDto);
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetProductVariant), new { id = id, variantId = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET: api/admin/products/{id}/variants/{variantId}
    [HttpGet("{id}/variants/{variantId}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult<ProductVariantDetailsDto>> GetProductVariant(int id, int variantId)
    {
        try
        {
            var query = new GetProductVariantDetailQuery { ProductId = id, VariantId = variantId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // PUT: api/admin/products/{id}/variants/{variantId}
    [HttpPut("{id}/variants/{variantId}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult<ProductVariantDetailsDto>> UpdateProductVariant(int id, int variantId, UpdateProductVariantDto variantDto)
    {
        try
        {
            var command = new UpdateProductVariantCommand(id, variantId, variantDto);
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE: api/admin/products/{id}/variants/{variantId}
    [HttpDelete("{id}/variants/{variantId}")]
    [AllowAnonymous] // Remove this in production and use proper authorization
    public async Task<ActionResult> DeleteProductVariant(int id, int variantId)
    {
        try
        {
            var command = new DeleteProductVariantCommand(id, variantId);
            var result = await _mediator.Send(command);
            
            if (result)
            {
                return NoContent();
            }
            
            return NotFound(new { message = $"Không tìm thấy biến thể {variantId} của sản phẩm {id}" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
} 