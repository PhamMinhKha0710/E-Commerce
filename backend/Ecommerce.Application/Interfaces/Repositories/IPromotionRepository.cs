using Ecommerce.Application.Common.DTOs;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IPromotionRepository
{
    Task<PromotionResponseClient> GetPromotionByCodeUserAsync(string code);
}