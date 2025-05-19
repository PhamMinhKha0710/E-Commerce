using Ecommerce.Application.Common.DTOs.Promotion;
using MediatR;

namespace Ecommerce.Application.Queries.Promotions;

public record GetAllPromotionsQuery : IRequest<List<PromotionDto>>; 