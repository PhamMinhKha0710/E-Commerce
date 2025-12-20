using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Promotion;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using MediatR;

namespace Ecommerce.Application.QueryHandlers;

public class GetPromotionByIdQueryHandler : IRequestHandler<GetPromotionByIdQuery, PromotionDto>
{
    private readonly IPromotionRepository _promotionRepository;

    public GetPromotionByIdQueryHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<PromotionDto> Handle(GetPromotionByIdQuery request, CancellationToken cancellationToken)
    {
        var promotion = await _promotionRepository.GetPromotionByIdAsync(request.Id);
        
        if (promotion == null)
        {
            throw new InvalidOperationException($"Không tìm thấy khuyến mãi với ID: {request.Id}");
        }
        
        return new PromotionDto
        {
            Id = promotion.Id,
            Name = promotion.Name,
            Code = promotion.Code,
            Description = promotion.Description,
            DiscountRate = promotion.DiscountRate,
            StartDate = promotion.StartDate,
            EndDate = promotion.EndDate,
            IsActive = promotion.IsActive,
            TotalQuantity = promotion.TotalQuantity,
            UsedQuantity = promotion.UsedQuantity,
            CategoryIds = promotion.PromotionCategories?.Select(pc => pc.ProductCategoryId).ToList() ?? new List<int>(),
            Categories = promotion.PromotionCategories?.Select(pc => new CategoryDto
            {
                id = pc.ProductCategory.Id,
                title = pc.ProductCategory.Name
            }).ToList() ?? new List<CategoryDto>()
        };
    }
} 