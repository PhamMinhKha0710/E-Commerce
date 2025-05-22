using MediatR;

namespace Ecommerce.Application.Commands.Brands;
 
public record DeleteBrandCommand(int Id) : IRequest<bool>; 