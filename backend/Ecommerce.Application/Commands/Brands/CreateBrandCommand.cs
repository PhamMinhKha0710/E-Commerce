using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Commands.Brands;
 
public record CreateBrandCommand(CreateBrandDto BrandDto) : IRequest<BrandDto>; 