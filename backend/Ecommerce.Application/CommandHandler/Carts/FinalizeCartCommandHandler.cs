using Ecommerce.Application.Commands.Cart;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandlers.Cart
{
    public class FinalizeCartCommandHandler : IRequestHandler<FinalizeCartCommand, CartDto>
    {
        private readonly ICartRepository _cartRepository;
        private readonly ILogger<FinalizeCartCommandHandler> _logger;

        public FinalizeCartCommandHandler(
            ICartRepository cartRepository,
            ILogger<FinalizeCartCommandHandler> logger)
        {
            _cartRepository = cartRepository;
            _logger = logger;
        }

        public async Task<CartDto> Handle(FinalizeCartCommand request, CancellationToken cancellationToken)
        {
            Console.WriteLine($"FinalizeCartCommandHandler : {request.LocalCartItems}");  
            try
            {
                _logger.LogInformation($"Finalizing cart for user {request.UserId} with {request.LocalCartItems.Count} items");
                
                var result = await _cartRepository.FinalizeCartAsync(request.UserId, request.LocalCartItems);
                
                _logger.LogInformation($"Successfully finalized cart for user {request.UserId}, returned cart has {result.CartItem.Count} items");
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error finalizing cart for user {request.UserId}");
                throw;
            }
        }
    }
} 