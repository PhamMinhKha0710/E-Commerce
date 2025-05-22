using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Brands;
 
public record GetBrandByIdQuery(int Id) : IRequest<BrandDto>; 