using MediatR;

namespace Ecommerce.Application.Queries.Promotions;

public record CheckPromotionAvailabilityQuery(string Code) : IRequest<bool>; 