using System.Collections.Generic;

namespace Ecommerce.Application.Common.DTOs.Blog;

public class PaginatedBlogPostsDto
{
    public List<BlogPostDto> Posts { get; set; } = new();
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int TotalPosts { get; set; }
    public int PageSize { get; set; }
}

