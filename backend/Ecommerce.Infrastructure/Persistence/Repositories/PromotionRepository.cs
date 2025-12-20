using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;
namespace Ecommerce.Infrastructure.Persistence.Repositories;

public class PromotionRepository : IPromotionRepository
{
    private readonly AppDbContext _context;

    public PromotionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PromotionResponseClient> GetPromotionByCodeUserAsync(string code)
    {
        var promotion = await _context.Promotions.FirstOrDefaultAsync(p => p.Code == code);

        if (promotion == null)
            throw new NotFoundException($"Promotion with code {code} not found");

        var listCartIdPromotion = await _context.PromotionCategories
            .Where(p => p.PromotionId == promotion.Id)
            .Select(p => p.ProductCategoryId)
            .ToListAsync();

        var remainingQuantity = promotion.TotalQuantity - promotion.UsedQuantity;
        bool isAvailable = remainingQuantity > 0 && promotion.IsActive;

        return new PromotionResponseClient
        {
            DiscountRate = promotion.DiscountRate,
            LimitDiscountPrice = promotion.LimitDiscountPrice,
            RemainingQuantity = remainingQuantity,
            StartDate = promotion.StartDate,
            EndDate = promotion.EndDate,
            IsAvailable = isAvailable,
            ListCartIdPromotion = listCartIdPromotion
        };
    }

    public async Task<List<Promotion>> GetAllPromotionsAsync()
    {
        return await _context.Promotions
            .Include(p => p.PromotionCategories)
            .ThenInclude(pc => pc.ProductCategory)
            .ToListAsync();
    }

    public async Task<Promotion> GetPromotionByIdAsync(int id)
    {
        var promotion = await _context.Promotions
            .Include(p => p.PromotionCategories)
            .ThenInclude(pc => pc.ProductCategory)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (promotion == null)
            throw new NotFoundException($"Promotion with id {id} not found");

        return promotion;
    }

    public async Task<Promotion> GetPromotionByCodeAsync(string code)
    {
        var promotion = await _context.Promotions
            .Include(p => p.PromotionCategories)
            .ThenInclude(pc => pc.ProductCategory)
            .FirstOrDefaultAsync(p => p.Code == code);

        if (promotion == null)
            throw new NotFoundException($"Promotion with code {code} not found");

        return promotion;
    }

    public async Task<Promotion> CreatePromotionAsync(Promotion promotion)
    {
        await _context.Promotions.AddAsync(promotion);
        await _context.SaveChangesAsync();
        return promotion;
    }

    public async Task<Promotion> UpdatePromotionAsync(Promotion promotion, List<int>? categoryIds = null)
    {
        var existingPromotion = await _context.Promotions
            .Include(p => p.PromotionCategories)
            .FirstOrDefaultAsync(p => p.Id == promotion.Id);

        if (existingPromotion == null)
            throw new NotFoundException($"Promotion with id {promotion.Id} not found");

        // Xóa các danh mục khuyến mãi hiện tại từ database
        if (existingPromotion.PromotionCategories != null && existingPromotion.PromotionCategories.Any())
        {
            _context.PromotionCategories.RemoveRange(existingPromotion.PromotionCategories);
            existingPromotion.PromotionCategories.Clear();
        }

        // Cập nhật thông tin khuyến mãi
        existingPromotion.Name = promotion.Name;
        existingPromotion.Code = promotion.Code;
        existingPromotion.Description = promotion.Description;
        existingPromotion.DiscountRate = promotion.DiscountRate;
        existingPromotion.StartDate = promotion.StartDate;
        existingPromotion.EndDate = promotion.EndDate;
        existingPromotion.IsActive = promotion.IsActive;
        existingPromotion.TotalQuantity = promotion.TotalQuantity;

        // Thêm danh mục khuyến mãi mới từ categoryIds (nếu được cung cấp)
        if (categoryIds != null && categoryIds.Any())
        {
            foreach (var categoryId in categoryIds)
            {
                // Tạo entity mới để tránh tracking conflict
                existingPromotion.PromotionCategories.Add(new PromotionCategory
                {
                    PromotionId = promotion.Id,
                    ProductCategoryId = categoryId
                });
            }
        }
        // Nếu categoryIds không được cung cấp, sử dụng từ promotion entity (backward compatibility)
        else if (promotion.PromotionCategories != null && promotion.PromotionCategories.Any())
        {
            foreach (var category in promotion.PromotionCategories)
            {
                existingPromotion.PromotionCategories.Add(new PromotionCategory
                {
                    PromotionId = promotion.Id,
                    ProductCategoryId = category.ProductCategoryId
                });
            }
        }

        await _context.SaveChangesAsync();
        return existingPromotion;
    }

    public async Task<bool> DeletePromotionAsync(int id)
    {
        var promotion = await _context.Promotions.FirstOrDefaultAsync(p => p.Id == id);
        if (promotion == null)
            return false;

        _context.Promotions.Remove(promotion);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<ProductCategory>> GetAllCategoriesAsync()
    {
        return await _context.ProductCategories.ToListAsync();
    }

    public async Task<bool> IsCodeUniqueAsync(string code, int? excludeId = null)
    {
        if (excludeId.HasValue)
        {
            return !await _context.Promotions.AnyAsync(p => p.Code == code && p.Id != excludeId.Value);
        }
        return !await _context.Promotions.AnyAsync(p => p.Code == code);
    }

    public async Task<bool> IsPromotionAvailableAsync(string code)
    {
        var now = DateTime.Now;
        var promotion = await _context.Promotions
            .FirstOrDefaultAsync(p => p.Code == code && p.IsActive);

        if (promotion == null)
            return false;

        if (now < promotion.StartDate || now > promotion.EndDate)
            return false;

        if (promotion.TotalQuantity > 0 && promotion.UsedQuantity >= promotion.TotalQuantity)
            return false;

        return true;
    }

    public async Task<bool> IncrementPromotionUsageAsync(int promotionId)
    {
        var promotion = await _context.Promotions.FirstOrDefaultAsync(p => p.Id == promotionId);
        if (promotion == null)
            return false;

        if (promotion.TotalQuantity > 0 && promotion.UsedQuantity >= promotion.TotalQuantity)
            return false;

        promotion.UsedQuantity += 1;
        await _context.SaveChangesAsync();
        return true;
    }
}