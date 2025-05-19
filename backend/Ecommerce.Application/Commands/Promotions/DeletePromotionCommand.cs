using MediatR;

namespace Ecommerce.Application.Commands.Promotions;

public record DeletePromotionCommand(int Id) : IRequest<bool>; 