using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Promotions;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Promotions;

public class CheckPromotionAvailabilityQueryHandler : IRequestHandler<CheckPromotionAvailabilityQuery, bool>
{
    private readonly IPromotionRepository _promotionRepository;

    public CheckPromotionAvailabilityQueryHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<bool> Handle(CheckPromotionAvailabilityQuery request, CancellationToken cancellationToken)
    {
        // Check if the promotion code exists, is active, within date range, and hasn't reached usage limit
        return await _promotionRepository.IsPromotionAvailableAsync(request.Code);
    }
} 