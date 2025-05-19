using Ecommerce.Application.Commands.Ratings;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Ratings;

public class UpdateProductRatingCommandHandler : IRequestHandler<UpdateProductRatingCommand, bool>
{
    private readonly IRatingRepository _ratingRepository;

    public UpdateProductRatingCommandHandler(IRatingRepository ratingRepository)
    {
        _ratingRepository = ratingRepository;
    }

    public async Task<bool> Handle(UpdateProductRatingCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _ratingRepository.UpdateProductRatingAsync(request.ProductId);
            return true;
        }
        catch
        {
            return false;
        }
    }
} 