using MediatR;

namespace Ecommerce.Application.Commands.Promotions;

public record IncrementPromotionUsageCommand(int PromotionId) : IRequest<bool>; 