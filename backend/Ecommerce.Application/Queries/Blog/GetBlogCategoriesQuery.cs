using Ecommerce.Application.Common.DTOs.Blog;
using MediatR;
using System.Collections.Generic;

namespace Ecommerce.Application.Queries.Blog
{
    public class GetBlogCategoriesQuery : IRequest<List<BlogCategoryDto>>
    {
        public bool OnlyActive { get; set; } = true;
    }
}

