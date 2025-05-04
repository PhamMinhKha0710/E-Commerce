using Ecommerce.Application.Interfaces;

using Ecommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Persistence.Repositories
{
    public class ProductItemRepository : IProductItemRepository
    {
        private readonly AppDbContext _dbContext;

        public ProductItemRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Product> GetProductWithDefaultItemAsync(int productId, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Products
                .Include(p => p.ProductItems.Where(pi => pi.IsDefault))
                .ThenInclude(pi => pi.ProductConfigurations)
                .ThenInclude(pc => pc.VariationOption)
                .ThenInclude(vo => vo.Variation)
                .Include(p => p.ProductCategory)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
        }

        public async Task UpdateElasticsearchIdAsync(int productId, string elasticsearchId, CancellationToken cancellationToken = default)
        {
            var product = await _dbContext.Products
                .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
            if (product == null)
                throw new Exception($"Product with ID {productId} not found");

            product.ElasticsearchId = elasticsearchId;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}