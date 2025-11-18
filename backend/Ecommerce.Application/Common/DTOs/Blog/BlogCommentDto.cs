using System;

namespace Ecommerce.Application.Common.DTOs.Blog;

public class BlogCommentDto
{
    public int Id { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

