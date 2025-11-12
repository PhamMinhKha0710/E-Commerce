using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ecommerce.Infrastructure.Persistence.Repositories
{
    public class BlogRepository : IBlogRepository
    {
        private readonly AppDbContext _context;

        public BlogRepository(AppDbContext context)
        {
            _context = context;
        }

        // Blog Posts
        public async Task<IEnumerable<BlogPost>> GetAllPostsAsync(int page, int pageSize, string? category = null, string? tag = null, bool onlyPublished = true)
        {
            var query = _context.BlogPosts
                .Include(p => p.Comments.Where(c => c.IsApproved))
                .AsQueryable();

            if (onlyPublished)
            {
                query = query.Where(p => p.IsPublished);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category == category);
            }

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(p => p.Tags.Contains(tag));
            }

            return await query
                .OrderByDescending(p => p.PublishedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalPostsCountAsync(string? category = null, string? tag = null, bool onlyPublished = true)
        {
            var query = _context.BlogPosts.AsQueryable();

            if (onlyPublished)
            {
                query = query.Where(p => p.IsPublished);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category == category);
            }

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(p => p.Tags.Contains(tag));
            }

            return await query.CountAsync();
        }

        public async Task<BlogPost?> GetPostByIdAsync(int id)
        {
            return await _context.BlogPosts
                .Include(p => p.Comments.Where(c => c.IsApproved))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<BlogPost?> GetPostBySlugAsync(string slug)
        {
            return await _context.BlogPosts
                .Include(p => p.Comments.Where(c => c.IsApproved))
                .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);
        }

        public async Task<IEnumerable<BlogPost>> GetHighlightedPostsAsync(int limit = 6)
        {
            return await _context.BlogPosts
                .Where(p => p.IsPublished && p.IsHighlighted)
                .OrderByDescending(p => p.PublishedDate)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<IEnumerable<BlogPost>> GetPostsByCategoryAsync(string category, int limit = 5)
        {
            return await _context.BlogPosts
                .Where(p => p.IsPublished && p.Category == category)
                .OrderByDescending(p => p.PublishedDate)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<IEnumerable<BlogPost>> GetRelatedPostsAsync(int postId, int limit = 4)
        {
            var post = await GetPostByIdAsync(postId);
            if (post == null) return new List<BlogPost>();

            return await _context.BlogPosts
                .Where(p => p.IsPublished && p.Id != postId && 
                       (p.Category == post.Category || p.Tags.Any(t => post.Tags.Contains(t))))
                .OrderByDescending(p => p.PublishedDate)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<BlogPost> CreatePostAsync(BlogPost post)
        {
            post.CreatedAt = DateTime.UtcNow;
            post.UpdatedAt = DateTime.UtcNow;
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<BlogPost> UpdatePostAsync(BlogPost post)
        {
            post.UpdatedAt = DateTime.UtcNow;
            _context.BlogPosts.Update(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task DeletePostAsync(int id)
        {
            var post = await GetPostByIdAsync(id);
            if (post != null)
            {
                _context.BlogPosts.Remove(post);
                await _context.SaveChangesAsync();
            }
        }

        public async Task IncrementViewCountAsync(int postId)
        {
            var post = await GetPostByIdAsync(postId);
            if (post != null)
            {
                post.ViewCount++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<BlogPost>> SearchPostsAsync(string searchTerm)
        {
            return await _context.BlogPosts
                .Where(p => p.IsPublished && 
                       (p.Title.Contains(searchTerm) || 
                        p.Excerpt.Contains(searchTerm) || 
                        p.Content.Contains(searchTerm)))
                .OrderByDescending(p => p.PublishedDate)
                .Take(20)
                .ToListAsync();
        }

        // Blog Categories
        public async Task<IEnumerable<BlogCategory>> GetAllCategoriesAsync(bool onlyActive = true)
        {
            var query = _context.BlogCategories.AsQueryable();
            
            if (onlyActive)
            {
                query = query.Where(c => c.IsActive);
            }

            return await query.OrderBy(c => c.DisplayOrder).ToListAsync();
        }

        public async Task<BlogCategory?> GetCategoryByIdAsync(int id)
        {
            return await _context.BlogCategories.FindAsync(id);
        }

        public async Task<BlogCategory?> GetCategoryBySlugAsync(string slug)
        {
            return await _context.BlogCategories.FirstOrDefaultAsync(c => c.Slug == slug);
        }

        public async Task<BlogCategory> CreateCategoryAsync(BlogCategory category)
        {
            category.CreatedAt = DateTime.UtcNow;
            category.UpdatedAt = DateTime.UtcNow;
            _context.BlogCategories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<BlogCategory> UpdateCategoryAsync(BlogCategory category)
        {
            category.UpdatedAt = DateTime.UtcNow;
            _context.BlogCategories.Update(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await GetCategoryByIdAsync(id);
            if (category != null)
            {
                _context.BlogCategories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }

        // Blog Comments
        public async Task<IEnumerable<BlogComment>> GetCommentsByPostIdAsync(int postId, bool onlyApproved = true)
        {
            var query = _context.BlogComments.Where(c => c.BlogPostId == postId);
            
            if (onlyApproved)
            {
                query = query.Where(c => c.IsApproved);
            }

            return await query.OrderByDescending(c => c.CreatedAt).ToListAsync();
        }

        public async Task<BlogComment?> GetCommentByIdAsync(int id)
        {
            return await _context.BlogComments.FindAsync(id);
        }

        public async Task<BlogComment> CreateCommentAsync(BlogComment comment)
        {
            comment.CreatedAt = DateTime.UtcNow;
            _context.BlogComments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<BlogComment> UpdateCommentAsync(BlogComment comment)
        {
            _context.BlogComments.Update(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task DeleteCommentAsync(int id)
        {
            var comment = await GetCommentByIdAsync(id);
            if (comment != null)
            {
                _context.BlogComments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ApproveCommentAsync(int id)
        {
            var comment = await GetCommentByIdAsync(id);
            if (comment != null)
            {
                comment.IsApproved = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}

