using Ecommerce.Application.Common.DTOs.Product;
using MediatR;

namespace Ecommerce.Application.Queries.Products;
 
public class GetAdminProductDetailQuery : IRequest<AdminProductDto>
{
    public int Id { get; set; }
} 