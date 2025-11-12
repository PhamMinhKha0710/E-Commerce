using System;
using System.Collections.Generic;

namespace Ecommerce.Domain.Entities
{
    public class BlogPost
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string FeaturedImage { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public DateTime PublishedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty; // Stored as comma-separated values
        public bool IsPublished { get; set; }
        public bool IsHighlighted { get; set; }
        public int ViewCount { get; set; }
        public string MetaTitle { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string MetaKeywords { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }
}

