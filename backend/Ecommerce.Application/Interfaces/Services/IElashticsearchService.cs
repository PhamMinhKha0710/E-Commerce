using Ecommerce.Application.Common.DTOs;

namespace Ecommerce.Infrastructure.Elasticsearch
{
    public interface IElasticsearchService
    {
        Task<ProductSearchResponseDto> SearchProductsAsync(ProductSearchRequestDto request);
        Task<ProductSearchResponseDto> SearchByImageAsync(byte[] imageData);
        Task<SuggestResponseDto> SuggestAsync(string query);
    }
}