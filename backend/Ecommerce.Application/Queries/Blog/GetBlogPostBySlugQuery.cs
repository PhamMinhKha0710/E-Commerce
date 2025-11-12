using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Blog
{
    public class GetBlogPostBySlugQuery : IRequest<BlogPostDetailDto?>
    {
        public string Slug { get; set; } = string.Empty;
        public bool IncrementViewCount { get; set; } = true;
    }
}

