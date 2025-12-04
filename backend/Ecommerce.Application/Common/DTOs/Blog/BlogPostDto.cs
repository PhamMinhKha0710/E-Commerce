using System;
using System.Collections.Generic;

namespace Ecommerce.Application.Common.DTOs.Blog;

public class BlogPostDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string FeaturedImage { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public DateTime PublishedDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public bool IsPublished { get; set; }
    public bool IsHighlighted { get; set; }
    public int ViewCount { get; set; }
    public int CommentCount { get; set; }
}
