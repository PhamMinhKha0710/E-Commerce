using Microsoft.AspNetCore.Mvc;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Infrastructure.Elasticsearch;

namespace Ecommerce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly IElasticsearchService _elasticsearchService;

        public SearchController(IElasticsearchService elasticsearchService)
        {
            _elasticsearchService = elasticsearchService;
        }

        [HttpPost("search")]
        public async Task<ActionResult<ProductSearchResponseDto>> Search([FromBody] ProductSearchRequestDto request)
        {
            try
            {
                var response = await _elasticsearchService.SearchProductsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorResponseDto { Message = $"Search failed: {ex.Message}" });
            }
        }

        [HttpPost("search-by-image")]
        public async Task<ActionResult<ProductSearchResponseDto>> SearchByImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest(new ErrorResponseDto { Message = "Image is required" });

            if (image.Length > 5 * 1024 * 1024)
                return BadRequest(new ErrorResponseDto { Message = "Image size exceeds 5MB limit" });

            try
            {
                using var stream = new MemoryStream();
                await image.CopyToAsync(stream);
                var imageData = stream.ToArray();

                var response = await _elasticsearchService.SearchByImageAsync(imageData);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorResponseDto { Message = $"Image search failed: {ex.Message}" });
            }
        }

        [HttpGet("suggest")]
        public async Task<ActionResult<SuggestResponseDto>> Suggest([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
                return BadRequest(new ErrorResponseDto { Message = "Query is required" });

            try
            {
                var response = await _elasticsearchService.SuggestAsync(query);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorResponseDto { Message = $"Suggestion failed: {ex.Message}" });
            }
        }
    }
}