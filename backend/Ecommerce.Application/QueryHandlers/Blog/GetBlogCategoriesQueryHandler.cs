using Ecommerce.Application.Common.DTOs.Blog;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Blog;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Ecommerce.Application.QueryHandlers.Blog
{
    public class GetBlogCategoriesQueryHandler : IRequestHandler<GetBlogCategoriesQuery, List<BlogCategoryDto>>
    {
        private readonly IBlogRepository _blogRepository;

        public GetBlogCategoriesQueryHandler(IBlogRepository blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<List<BlogCategoryDto>> Handle(GetBlogCategoriesQuery request, CancellationToken cancellationToken)
        {
            var categories = await _blogRepository.GetAllCategoriesAsync(request.OnlyActive);

            return categories.Select(c => new BlogCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description
            }).ToList();
        }
    }
}

