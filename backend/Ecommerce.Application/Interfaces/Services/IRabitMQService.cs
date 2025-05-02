namespace Ecommerce.Application.Interfaces
{
    public interface IRabbitMQService
    {
        Task PublishMessageAsync(string queue, string message);
    }
}