using MediatR;

namespace Ecommerce.Application.Commands.ProductCommands
{
    public class UpdateElasticsearchIdCommand : IRequest<Unit>
    {
        public int ProductId { get; set; }
        public string ElasticsearchId { get; set; }
    }
}