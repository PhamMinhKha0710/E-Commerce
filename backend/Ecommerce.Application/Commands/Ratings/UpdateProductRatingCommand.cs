using MediatR;

namespace Ecommerce.Application.Commands.Ratings;
 
public class UpdateProductRatingCommand : IRequest<bool>
{
    public int ProductId { get; set; }
} 