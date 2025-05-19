using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Promotion;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Promotions;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Ecommerce.Application.QueryHandlers.Promotions;

public class GetAllPromotionsQueryHandler : IRequestHandler<GetAllPromotionsQuery, List<PromotionDto>>
{
    private readonly IPromotionRepository _promotionRepository;

    public GetAllPromotionsQueryHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<List<PromotionDto>> Handle(GetAllPromotionsQuery request, CancellationToken cancellationToken)
    {
        // Use the cached repository method to get promotions
        var promotions = await _promotionRepository.GetAllPromotionsAsync();
        
        // Process promotions in memory after retrieving them from cache
        // This is more efficient than multiple DB queries
        return promotions.Select(p => new PromotionDto
        {
            Id = p.Id,
            Name = p.Name,
            Code = p.Code,
            Description = p.Description,
            DiscountRate = p.DiscountRate,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            IsActive = p.IsActive,
            TotalQuantity = p.TotalQuantity,
            UsedQuantity = p.UsedQuantity,
            // Status = GetPromotionStatus(p),
            CategoryIds = p.PromotionCategories?.Select(pc => pc.ProductCategoryId).ToList() ?? new List<int>(),
            Categories = p.PromotionCategories?.Select(pc => new CategoryDto
            {
                id = pc.ProductCategory.Id,
                title = pc.ProductCategory.Name
            }).ToList() ?? new List<CategoryDto>()
        }).ToList();
    }
    
    private static string GetPromotionStatus(Ecommerce.Domain.Entities.Promotion promotion)
    {
        var now = System.DateTime.Now;
        
        if (!promotion.IsActive)
            return "Không hoạt động";
            
        if (now < promotion.StartDate)
            return "Chưa bắt đầu";
            
        if (now > promotion.EndDate)
            return "Đã kết thúc";
            
        if (promotion.TotalQuantity > 0 && promotion.UsedQuantity >= promotion.TotalQuantity)
            return "Đã hết lượt";
            
        return "Đã kết thúc";
    }
} 