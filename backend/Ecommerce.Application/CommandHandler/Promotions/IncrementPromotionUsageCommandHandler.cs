using Ecommerce.Application.Commands.Promotions;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Promotions;

public class IncrementPromotionUsageCommandHandler : IRequestHandler<IncrementPromotionUsageCommand, bool>
{
    private readonly IPromotionRepository _promotionRepository;

    public IncrementPromotionUsageCommandHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<bool> Handle(IncrementPromotionUsageCommand request, CancellationToken cancellationToken)
    {
        // Try to increment the usage counter
        // Returns false if promotion doesn't exist or has reached its usage limit
        return await _promotionRepository.IncrementPromotionUsageAsync(request.PromotionId);
    }
} 