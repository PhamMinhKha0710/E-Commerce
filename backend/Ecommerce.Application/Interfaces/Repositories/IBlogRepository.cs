using Ecommerce.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ecommerce.Application.Interfaces.Repositories
{
    public interface IBlogRepository
    {
        // Blog Posts
        Task<IEnumerable<BlogPost>> GetAllPostsAsync(int page, int pageSize, string? category = null, string? tag = null, bool onlyPublished = true);
        Task<int> GetTotalPostsCountAsync(string? category = null, string? tag = null, bool onlyPublished = true);
        Task<BlogPost?> GetPostByIdAsync(int id);
        Task<BlogPost?> GetPostBySlugAsync(string slug);
        Task<IEnumerable<BlogPost>> GetHighlightedPostsAsync(int limit = 6);
        Task<IEnumerable<BlogPost>> GetPostsByCategoryAsync(string category, int limit = 5);
        Task<IEnumerable<BlogPost>> GetRelatedPostsAsync(int postId, int limit = 4);
        Task<BlogPost> CreatePostAsync(BlogPost post);
        Task<BlogPost> UpdatePostAsync(BlogPost post);
        Task DeletePostAsync(int id);
        Task IncrementViewCountAsync(int postId);
        Task<IEnumerable<BlogPost>> SearchPostsAsync(string searchTerm);

        // Blog Categories
        Task<IEnumerable<BlogCategory>> GetAllCategoriesAsync(bool onlyActive = true);
        Task<BlogCategory?> GetCategoryByIdAsync(int id);
        Task<BlogCategory?> GetCategoryBySlugAsync(string slug);
        Task<BlogCategory> CreateCategoryAsync(BlogCategory category);
        Task<BlogCategory> UpdateCategoryAsync(BlogCategory category);
        Task DeleteCategoryAsync(int id);

        // Blog Comments
        Task<IEnumerable<BlogComment>> GetCommentsByPostIdAsync(int postId, bool onlyApproved = true);
        Task<BlogComment?> GetCommentByIdAsync(int id);
        Task<BlogComment> CreateCommentAsync(BlogComment comment);
        Task<BlogComment> UpdateCommentAsync(BlogComment comment);
        Task DeleteCommentAsync(int id);
        Task ApproveCommentAsync(int id);
    }
}

