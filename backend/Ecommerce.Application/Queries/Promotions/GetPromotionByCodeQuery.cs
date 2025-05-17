using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries;

public class GetPromotionByCodeQuery : IRequest<PromotionResponseClient>
{
    public string code { get; set; }
}