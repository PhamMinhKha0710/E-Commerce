using Ecommerce.Application.Common.DTOs;
using MediatR;

namespace Ecommerce.Application.Queries;

public class GetSubCategoriesQuery : IRequest<List<CategoryDto>>
{
    public int CategoryId { get; set; }
}