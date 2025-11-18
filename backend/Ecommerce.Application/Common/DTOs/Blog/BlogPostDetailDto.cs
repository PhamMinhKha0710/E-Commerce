using System.Collections.Generic;

namespace Ecommerce.Application.Common.DTOs.Blog;

public class BlogPostDetailDto : BlogPostDto
{
    public System.DateTime? UpdatedDate { get; set; }
    public string MetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public string MetaKeywords { get; set; } = string.Empty;
    public List<BlogCommentDto> Comments { get; set; } = new();
    public List<BlogPostDto> RelatedPosts { get; set; } = new();
}

