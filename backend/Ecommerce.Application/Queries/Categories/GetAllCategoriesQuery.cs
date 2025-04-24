using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries.Categories;

public class GetAllCategoriesQuery : IRequest<List<CategoryDto>>
{
} 