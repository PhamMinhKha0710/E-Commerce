using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using MediatR;

namespace Ecommerce.Application.QueryHandlers;
public class GetSubCategoriesQueryHandler : IRequestHandler<GetSubCategoriesQuery, List<CategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;

    public GetSubCategoriesQueryHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<List<CategoryDto>> Handle(GetSubCategoriesQuery request, CancellationToken cancellationToken)
    {
        var subcategories = await _categoryRepository.GetSubcategoriesByCategoryIdAsync(request.CategoryId);
        return subcategories.Select(c => new CategoryDto
        {
            id = c.Id,
            title = c.Name
        }).ToList();
    }
}