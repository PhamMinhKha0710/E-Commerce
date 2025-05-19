using Ecommerce.Application.Common.DTOs;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IPromotionRepository
{
    Task<PromotionResponseClient> GetPromotionByCodeUserAsync(string code);
    Task<List<Promotion>> GetAllPromotionsAsync();
    Task<Promotion> GetPromotionByIdAsync(int id);
    Task<Promotion> GetPromotionByCodeAsync(string code);
    Task<Promotion> CreatePromotionAsync(Promotion promotion);
    Task<Promotion> UpdatePromotionAsync(Promotion promotion);
    Task<bool> DeletePromotionAsync(int id);
    Task<List<ProductCategory>> GetAllCategoriesAsync();
    Task<bool> IsCodeUniqueAsync(string code, int? excludeId = null);
    
    // New methods for promotion usage
    Task<bool> IsPromotionAvailableAsync(string code);
    Task<bool> IncrementPromotionUsageAsync(int promotionId);
}