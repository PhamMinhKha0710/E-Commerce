using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Cart;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.QueryHandlers.Cart
{
    public class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto>
    {
        private readonly ICartRepository _cartRepository;
        private readonly ILogger<GetCartQueryHandler> _logger;

        public GetCartQueryHandler(
            ICartRepository cartRepository,
            ILogger<GetCartQueryHandler> logger)
        {
            _cartRepository = cartRepository;
            _logger = logger;
        }

        public async Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Handling GetCartQuery for user {request.UserId}");
            
            var result = await _cartRepository.GetCartByUserIdAsync(request.UserId);
            
            _logger.LogInformation($"Retrieved cart for user {request.UserId} with {result.CartItem.Count} items");
            
            return result;
        }
    }
} 