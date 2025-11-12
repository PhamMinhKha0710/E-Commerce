using System;
using System.Collections.Generic;

namespace Ecommerce.Application.Common.DTOs.Blog
{
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

    public class BlogPostDetailDto : BlogPostDto
    {
        public DateTime? UpdatedDate { get; set; }
        public string MetaTitle { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string MetaKeywords { get; set; } = string.Empty;
        public List<BlogCommentDto> Comments { get; set; } = new();
        public List<BlogPostDto> RelatedPosts { get; set; } = new();
    }

    public class BlogCommentDto
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class BlogCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PostCount { get; set; }
    }

    public class PaginatedBlogPostsDto
    {
        public List<BlogPostDto> Posts { get; set; } = new();
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalPosts { get; set; }
        public int PageSize { get; set; }
    }
}

