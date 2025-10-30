using Ecommerce.Application.Commands;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Promotion;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;

namespace Ecommerce.Application.CommandHandler;

public class CreatePromotionCommandHandler : IRequestHandler<CreatePromotionCommand, PromotionDto>
{
    private readonly IPromotionRepository _promotionRepository;

    public CreatePromotionCommandHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<PromotionDto> Handle(CreatePromotionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;
        
        // Check if PromotionCode is unique
        bool isCodeUnique = await _promotionRepository.IsCodeUniqueAsync(dto.Code);
        if (!isCodeUnique)
            throw new InvalidOperationException("Mã khuyến mãi đã tồn tại. Vui lòng chọn mã khác.");
        
        // Validate dates
        if (dto.StartDate >= dto.EndDate)
            throw new InvalidOperationException("Ngày kết thúc phải sau ngày bắt đầu.");

        var promotion = new Promotion
        {
            Name = dto.Name,
            Code = dto.Code,
            Description = dto.Description,
            DiscountRate = dto.DiscountRate,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            IsActive = dto.IsActive,
            TotalQuantity = dto.TotalQuantity,
            UsedQuantity = 0, // Always initialize to 0
            PromotionCategories = new List<PromotionCategory>()
        };
        
        // Add categories if any
        if (dto.CategoryIds != null && dto.CategoryIds.Any())
        {
            promotion.PromotionCategories = dto.CategoryIds.Select(categoryId => new PromotionCategory
            {
                ProductCategoryId = categoryId
            }).ToList();
        }
        
        // Save to database
        var result = await _promotionRepository.CreatePromotionAsync(promotion);
        
        // After creating, we need to reload the entity with navigation properties included
        var createdPromotion = await _promotionRepository.GetPromotionByIdAsync(result.Id);
        
        // Get all categories for response
        var categories = new List<CategoryDto>();
        if (createdPromotion.PromotionCategories != null && createdPromotion.PromotionCategories.Any())
        {
            categories = createdPromotion.PromotionCategories
                .Where(pc => pc.ProductCategory != null)  // Safety check
                .Select(pc => new CategoryDto
                {
                    id = pc.ProductCategory.Id,
                    title = pc.ProductCategory.Name
                })
                .ToList();
        }
        
        // Map to DTO and return
        return new PromotionDto
        {
            Id = createdPromotion.Id,
            Name = createdPromotion.Name,
            Code = createdPromotion.Code,
            Description = createdPromotion.Description,
            DiscountRate = createdPromotion.DiscountRate,
            StartDate = createdPromotion.StartDate,
            EndDate = createdPromotion.EndDate,
            IsActive = createdPromotion.IsActive,
            TotalQuantity = createdPromotion.TotalQuantity,
            UsedQuantity = createdPromotion.UsedQuantity,
            CategoryIds = dto.CategoryIds ?? new List<int>(),
            Categories = categories
        };
    }
} 