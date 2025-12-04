using Ecommerce.Application.Common.DTOs.Blog;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Blog;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Ecommerce.Application.QueryHandlers.Blog
{
    public class GetBlogPostsQueryHandler : IRequestHandler<GetBlogPostsQuery, PaginatedBlogPostsDto>
    {
        private readonly IBlogRepository _blogRepository;

        public GetBlogPostsQueryHandler(IBlogRepository blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<PaginatedBlogPostsDto> Handle(GetBlogPostsQuery request, CancellationToken cancellationToken)
        {
            var posts = await _blogRepository.GetAllPostsAsync(
                request.Page, 
                request.PageSize, 
                request.Category, 
                request.Tag,
                request.OnlyPublished);

            var totalPosts = await _blogRepository.GetTotalPostsCountAsync(
                request.Category, 
                request.Tag,
                request.OnlyPublished);

            var postDtos = posts.Select(p => new BlogPostDto
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
                IsPublished = p.IsPublished,
                IsHighlighted = p.IsHighlighted,
                ViewCount = p.ViewCount,
                CommentCount = p.Comments?.Count ?? 0
            }).ToList();

            return new PaginatedBlogPostsDto
            {
                Posts = postDtos,
                CurrentPage = request.Page,
                TotalPages = (int)System.Math.Ceiling((double)totalPosts / request.PageSize),
                TotalPosts = totalPosts,
                PageSize = request.PageSize
            };
        }
    }
}

