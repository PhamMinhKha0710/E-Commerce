using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Blog
{
    public class GetBlogPostsQuery : IRequest<PaginatedBlogPostsDto>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Category { get; set; }
        public string? Tag { get; set; }
        public string? SearchTerm { get; set; }
        public bool OnlyPublished { get; set; } = true;
        public bool OnlyHighlighted { get; set; } = false;
    }
}

