using System.ComponentModel.DataAnnotations;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using MediatR;

namespace Ecommerce.Application.QueryHandlers;

public class GetPromotionByCodeQueryHandler : IRequestHandler<GetPromotionByCodeQuery, PromotionResponseClient>
{
    
    private readonly IPromotionRepository _promotionRepository;
    public GetPromotionByCodeQueryHandler(IPromotionRepository promotionRepository)
    {
        _promotionRepository = promotionRepository;
    }
    public async Task<PromotionResponseClient> Handle(GetPromotionByCodeQuery query, CancellationToken cancellationToken)
    {
        var promotion = await _promotionRepository.GetPromotionByCodeUserAsync(query.code);

        return promotion;
    }
}