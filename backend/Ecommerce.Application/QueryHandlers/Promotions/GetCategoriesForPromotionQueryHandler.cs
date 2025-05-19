using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Promotions;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Promotions;

public class GetCategoriesForPromotionQueryHandler : IRequestHandler<GetCategoriesForPromotionQuery, List<CategoryDto>>
{
    private readonly IPromotionRepository _promotionRepository;

    public GetCategoriesForPromotionQueryHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<List<CategoryDto>> Handle(GetCategoriesForPromotionQuery request, CancellationToken cancellationToken)
    {
        var categories = await _promotionRepository.GetAllCategoriesAsync();
        
        return categories.Select(c => new CategoryDto
        {
            id = c.Id,
            title = c.Name
        }).ToList();
    }
} 