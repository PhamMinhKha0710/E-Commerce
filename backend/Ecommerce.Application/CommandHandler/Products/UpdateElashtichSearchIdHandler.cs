using Ecommerce.Application.Commands.ProductCommands;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Ecommerce.Application.CommandHandler.ProductHandler
{
    public class UpdateElasticsearchIdHandler : IRequestHandler<UpdateElasticsearchIdCommand, Unit>
    {
        private readonly IProductItemRepository _productItemRepository;
        private readonly ILogger<UpdateElasticsearchIdHandler> _logger;

        public UpdateElasticsearchIdHandler(IProductItemRepository productItemRepository, ILogger<UpdateElasticsearchIdHandler> logger)
        {
            _productItemRepository = productItemRepository;
            _logger = logger;
        }

        public async Task<Unit> Handle(UpdateElasticsearchIdCommand request, CancellationToken cancellationToken)
        {
            await _productItemRepository.UpdateElasticsearchIdAsync(request.ProductId, request.ElasticsearchId, cancellationToken);
            _logger.LogInformation("Updated ElasticsearchId for productId={ProductId} to {ElasticsearchId}", request.ProductId, request.ElasticsearchId);
            return Unit.Value;
        }
    }
}