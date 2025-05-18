using Ecommerce.Application.Common;
using MediatR;

namespace Ecommerce.Application.Queries;

public class GetAllShippingMethodQueries : IRequest<List<ShippingInfoResponeDto>>;