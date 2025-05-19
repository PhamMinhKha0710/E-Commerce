using Ecommerce.Application.Commands;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Promotion;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;

namespace Ecommerce.Application.CommandHandler;

public class UpdatePromotionCommandHandler : IRequestHandler<UpdatePromotionCommand, PromotionDto>
{
    private readonly IPromotionRepository _promotionRepository;

    public UpdatePromotionCommandHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<PromotionDto> Handle(UpdatePromotionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.PromotionDto;
        
        // Check if promotion exists
        var existingPromotion = await _promotionRepository.GetPromotionByIdAsync(dto.Id);
        if (existingPromotion == null)
        {
            throw new InvalidOperationException($"Không tìm thấy khuyến mãi với ID: {dto.Id}");
        }
        
        // Check code uniqueness only if code has changed
        if (existingPromotion.Code != dto.Code)
        {
            bool isCodeUnique = await _promotionRepository.IsCodeUniqueAsync(dto.Code, dto.Id);
            if (!isCodeUnique)
            {
                throw new InvalidOperationException($"Mã khuyến mãi '{dto.Code}' đã tồn tại. Vui lòng chọn mã khác.");
            }
        }
        
        // Validate dates
        if (dto.StartDate >= dto.EndDate)
        {
            throw new InvalidOperationException("Ngày bắt đầu phải trước ngày kết thúc.");
        }
        
        // Update the promotion entity
        existingPromotion.Name = dto.Name;
        existingPromotion.Code = dto.Code;
        existingPromotion.Description = dto.Description;
        existingPromotion.DiscountRate = dto.DiscountRate;
        existingPromotion.StartDate = dto.StartDate;
        existingPromotion.EndDate = dto.EndDate;
        existingPromotion.IsActive = dto.IsActive;
        existingPromotion.TotalQuantity = dto.TotalQuantity;
        
        // Clear and rebuild promotion categories
        existingPromotion.PromotionCategories = new List<PromotionCategory>();
        
        // Add categories if any
        if (dto.CategoryIds != null && dto.CategoryIds.Any())
        {
            existingPromotion.PromotionCategories = dto.CategoryIds.Select(categoryId => new PromotionCategory
            {
                PromotionId = dto.Id,
                ProductCategoryId = categoryId
            }).ToList();
        }
        
        // Save to database
        var result = await _promotionRepository.UpdatePromotionAsync(existingPromotion);
        
        // Get all categories for response
        var categories = new List<CategoryDto>();
        if (result.PromotionCategories != null)
        {
            categories = result.PromotionCategories
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
            Id = result.Id,
            Name = result.Name,
            Code = result.Code,
            Description = result.Description,
            DiscountRate = result.DiscountRate,
            StartDate = result.StartDate,
            EndDate = result.EndDate,
            IsActive = result.IsActive,
            TotalQuantity = result.TotalQuantity,
            UsedQuantity = result.UsedQuantity,
            CategoryIds = dto.CategoryIds,
            Categories = categories
        };
    }
} 