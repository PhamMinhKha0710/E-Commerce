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
        
        // Update the promotion entity properties only (don't modify navigation properties here)
        existingPromotion.Name = dto.Name;
        existingPromotion.Code = dto.Code;
        existingPromotion.Description = dto.Description;
        existingPromotion.DiscountRate = dto.DiscountRate;
        existingPromotion.StartDate = dto.StartDate;
        existingPromotion.EndDate = dto.EndDate;
        existingPromotion.IsActive = dto.IsActive;
        existingPromotion.TotalQuantity = dto.TotalQuantity;
        
        // Save to database - repository will handle category updates
        var result = await _promotionRepository.UpdatePromotionAsync(existingPromotion, dto.CategoryIds ?? new List<int>());
        
        // Reload promotion with navigation properties
        var updatedPromotion = await _promotionRepository.GetPromotionByIdAsync(result.Id);
        
        // Get all categories for response
        var categories = new List<CategoryDto>();
        if (updatedPromotion.PromotionCategories != null && updatedPromotion.PromotionCategories.Any())
        {
            categories = updatedPromotion.PromotionCategories
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
            Id = updatedPromotion.Id,
            Name = updatedPromotion.Name,
            Code = updatedPromotion.Code,
            Description = updatedPromotion.Description,
            DiscountRate = updatedPromotion.DiscountRate,
            StartDate = updatedPromotion.StartDate,
            EndDate = updatedPromotion.EndDate,
            IsActive = updatedPromotion.IsActive,
            TotalQuantity = updatedPromotion.TotalQuantity,
            UsedQuantity = updatedPromotion.UsedQuantity,
            CategoryIds = dto.CategoryIds ?? new List<int>(),
            Categories = categories
        };
    }
} 