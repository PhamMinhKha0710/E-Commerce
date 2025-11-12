using System;

namespace Ecommerce.Domain.Entities
{
    public class BlogComment
    {
        public int Id { get; set; }
        public int BlogPostId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation property
        public virtual BlogPost BlogPost { get; set; } = null!;
    }
}

