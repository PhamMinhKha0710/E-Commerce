using Ecommerce.Application.Common.DTOs.Blog;
using Ecommerce.Application.Queries.Blog;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BlogController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/blog
        [HttpGet]
        public async Task<ActionResult<PaginatedBlogPostsDto>> GetBlogPosts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? tag = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] bool onlyPublished = true,
            [FromQuery] bool onlyHighlighted = false)
        {
            var query = new GetBlogPostsQuery
            {
                Page = page,
                PageSize = pageSize,
                Category = category,
                Tag = tag,
                SearchTerm = searchTerm,
                OnlyPublished = onlyPublished,
                OnlyHighlighted = onlyHighlighted
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/blog/{slug}
        [HttpGet("{slug}")]
        public async Task<ActionResult<BlogPostDetailDto>> GetBlogPostBySlug(string slug)
        {
            var query = new GetBlogPostBySlugQuery
            {
                Slug = slug,
                IncrementViewCount = true
            };

            var result = await _mediator.Send(query);

            if (result == null)
            {
                return NotFound(new { message = "Blog post not found" });
            }

            return Ok(result);
        }

        // GET: api/blog/categories
        [HttpGet("categories")]
        public async Task<ActionResult<List<BlogCategoryDto>>> GetCategories([FromQuery] bool onlyActive = true)
        {
            var query = new GetBlogCategoriesQuery
            {
                OnlyActive = onlyActive
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // GET: api/blog/highlighted
        [HttpGet("highlighted")]
        public async Task<ActionResult<PaginatedBlogPostsDto>> GetHighlightedPosts([FromQuery] int pageSize = 6)
        {
            var query = new GetBlogPostsQuery
            {
                Page = 1,
                PageSize = pageSize,
                OnlyPublished = true,
                OnlyHighlighted = true
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}

