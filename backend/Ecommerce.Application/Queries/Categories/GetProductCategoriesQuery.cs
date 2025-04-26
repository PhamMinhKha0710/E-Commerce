using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries;
public record GetProductCategoriesQuery : IRequest<List<ProductCategoryDto>>;