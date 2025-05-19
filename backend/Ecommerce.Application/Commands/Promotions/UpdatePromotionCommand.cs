using Ecommerce.Application.Common.DTOs.Promotion;
using MediatR;

namespace Ecommerce.Application.Commands;

public record UpdatePromotionCommand(UpdatePromotionDto PromotionDto) : IRequest<PromotionDto>; 