using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace  Ecommerce.Infrastructure.Persistence.Repositories;

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

        var remainingQuantity = promotion.TotalQuantity - promotion.UsedQuantity;
        bool IsAvailable = false;
        if (remainingQuantity > 0 && promotion.IsActive)
            IsAvailable = true;

            return new PromotionResponseClient
            {
                DiscountRate = promotion.DiscountRate,
                LimitDiscountPrice = promotion.LimitDiscountPrice,
                RemainingQuantity = remainingQuantity,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                IsAvailable = IsAvailable
            };
    }
}