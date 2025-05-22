using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Commands.Brands;
 
public record UpdateBrandCommand(int Id, UpdateBrandDto BrandDto) : IRequest<BrandDto>; 