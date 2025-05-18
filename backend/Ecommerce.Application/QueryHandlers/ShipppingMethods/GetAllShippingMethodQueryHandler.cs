using System.Security;
using Ecommerce.Application.Common;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries;
using MediatR;

namespace Ecommerce.Application.QueryHandlers;

public class GetAllShippingMethodQueryHandler : IRequestHandler<GetAllShippingMethodQueries, List<ShippingInfoResponeDto>>
{
    private readonly IShippingMethodRepository _shippingMethodRepository;
    public GetAllShippingMethodQueryHandler(IShippingMethodRepository shippingMethodRepository)
    {
        _shippingMethodRepository = shippingMethodRepository;
    }

    public async Task<List<ShippingInfoResponeDto>> Handle(GetAllShippingMethodQueries queries, CancellationToken cancellationToken)
    {
        return await _shippingMethodRepository.GetAllShippingMethodAsync();
    }
}