using Ecommerce.Application.Commands.Promotions;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Promotions;

public class DeletePromotionCommandHandler : IRequestHandler<DeletePromotionCommand, bool>
{
    private readonly IPromotionRepository _promotionRepository;

    public DeletePromotionCommandHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }

    public async Task<bool> Handle(DeletePromotionCommand request, CancellationToken cancellationToken)
    {
        // Check if promotion exists
        var existingPromotion = await _promotionRepository.GetPromotionByIdAsync(request.Id);
        if (existingPromotion == null)
        {
            throw new InvalidOperationException($"Không tìm thấy khuyến mãi với ID: {request.Id}");
        }
        
        // Delete from database
        return await _promotionRepository.DeletePromotionAsync(request.Id);
    }
} 