using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Promotions;

public record GetCategoriesForPromotionQuery : IRequest<List<CategoryDto>>; 