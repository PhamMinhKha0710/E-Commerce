using Ecommerce.Application.Common.DTOs.Promotion;
using MediatR;

namespace Ecommerce.Application.Queries;

public record GetPromotionByIdQuery(int Id) : IRequest<PromotionDto>; 