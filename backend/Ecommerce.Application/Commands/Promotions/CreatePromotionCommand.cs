using Ecommerce.Application.Common.DTOs.Promotion;
using MediatR;

namespace Ecommerce.Application.Commands;

public record CreatePromotionCommand(CreatePromotionDto Dto) : IRequest<PromotionDto>;