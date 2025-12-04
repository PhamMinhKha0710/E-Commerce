using Ecommerce.Application.Common.DTOs.Blog;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Blog;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Ecommerce.Application.QueryHandlers.Blog
{
    public class GetBlogPostBySlugQueryHandler : IRequestHandler<GetBlogPostBySlugQuery, BlogPostDetailDto?>
    {
        private readonly IBlogRepository _blogRepository;

        public GetBlogPostBySlugQueryHandler(IBlogRepository blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<BlogPostDetailDto?> Handle(GetBlogPostBySlugQuery request, CancellationToken cancellationToken)
        {
            var post = await _blogRepository.GetPostBySlugAsync(request.Slug);

            if (post == null)
                return null;

            if (request.IncrementViewCount)
            {
                await _blogRepository.IncrementViewCountAsync(post.Id);
            }

            var relatedPosts = await _blogRepository.GetRelatedPostsAsync(post.Id, 4);

            return new BlogPostDetailDto
            {
                Id = post.Id,
                Title = post.Title,
                Slug = post.Slug,
                Excerpt = post.Excerpt,
                Content = post.Content,
                FeaturedImage = post.FeaturedImage,
                Author = post.Author,
                PublishedDate = post.PublishedDate,
                UpdatedDate = post.UpdatedDate,
                Category = post.Category,
                Tags = string.IsNullOrEmpty(post.Tags) ? new() : post.Tags.Split(',').ToList(),
                IsPublished = post.IsPublished,
                IsHighlighted = post.IsHighlighted,
                ViewCount = post.ViewCount,
                MetaTitle = post.MetaTitle,
                MetaDescription = post.MetaDescription,
                MetaKeywords = post.MetaKeywords,
                CommentCount = post.Comments?.Count ?? 0,
                Comments = post.Comments?.Select(c => new BlogCommentDto
                {
                    Id = c.Id,
                    AuthorName = c.AuthorName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                }).ToList() ?? new(),
                RelatedPosts = relatedPosts.Select(p => new BlogPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Slug = p.Slug,
                    Excerpt = p.Excerpt,
                    FeaturedImage = p.FeaturedImage,
                    Author = p.Author,
                    PublishedDate = p.PublishedDate,
                    Category = p.Category,
                    Tags = string.IsNullOrEmpty(p.Tags) ? new() : p.Tags.Split(',').ToList(),
                }).ToList()
            };
        }
    }
}

