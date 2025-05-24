using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Application.Queries.Products;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Products
{
    public class GetProductDetailQueryHandler : IRequestHandler<GetProductDetailQuery, ProductDetailDto>
    {
        private readonly IProductRepository _productRepository;

        public GetProductDetailQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<ProductDetailDto> Handle(GetProductDetailQuery request, CancellationToken cancellationToken)
        {
            var product = await _productRepository
                .Query()
                .Include(p => p.ProductCategory)
                .Include(p => p.Brand)
                .Include(p => p.ProductImages)
                .Include(p => p.ProductItems)
                .ThenInclude(pi => pi.ProductConfigurations)
                .ThenInclude(pc => pc.VariationOption)
                .ThenInclude(vo => vo.Variation)
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return null;
            }

            var productDetail = new ProductDetailDto
            {
                ProductId = product.Id,
                Slug = product.Slug,
                Name = product.Name,
                CategoryId = product.ProductCategoryId,
                Category = product.ProductCategory?.Name ?? string.Empty,
                Brand = product.Brand?.Name ?? string.Empty,
                Description = product.Description,
                Currency = product.Currency,
                HasVariations = product.HasVariation,
                Images = product.ProductImages?.Select(pi => pi.ImageUrl).ToList() ?? new List<string>(),
                Seller = new SellerDto
                {
                    Name = "ND Mall",
                    Url = "https://nd-mall.mysapo.net",
                    Logo = "https://nd-mall.mysapo.net/logo.png"
                }
            };

            var defaultProductItem = product.ProductItems.FirstOrDefault(pi => pi.IsDefault);
            if (defaultProductItem != null)
            {
                productDetail.Image = defaultProductItem.ImageUrl;
                productDetail.Price = (decimal)defaultProductItem.Price;
                productDetail.OldPrice = (decimal)defaultProductItem.OldPrice;
                productDetail.Availability = defaultProductItem.QtyInStock > 0 ? "InStock" : "OutOfStock";
                productDetail.DefaultCombinationId = defaultProductItem.Id.ToString();
            }
            else if (product.ProductItems.Any())
            {
                var firstProductItem = product.ProductItems.First();
                productDetail.Image = firstProductItem.ImageUrl;
                productDetail.Price = (decimal)firstProductItem.Price;
                productDetail.OldPrice = (decimal)firstProductItem.OldPrice;
                productDetail.Availability = firstProductItem.QtyInStock > 0 ? "InStock" : "OutOfStock";
                productDetail.DefaultCombinationId = firstProductItem.Id.ToString();
            }

            if (product.HasVariation)
            {
                var variantGroups = product.ProductItems
                    .SelectMany(pi => pi.ProductConfigurations)
                    .Select(pc => new { pc.VariationOption.Variation })
                    .Distinct()
                    .Select(v => new VariantGroupDto
                    {
                        Name = v.Variation.Value,
                        Options = product.ProductItems
                            .SelectMany(pi => pi.ProductConfigurations)
                            .Where(pc => pc.VariationOption.VariationId == v.Variation.Id)
                            .Select(pc => new VariantOptionDto
                            {
                                Value = pc.VariationOption.Value,
                                Label = pc.VariationOption.Value,
                                Available = product.ProductItems
                                    .Where(pi => pi.ProductConfigurations.Any(c => c.VariationOptionId == pc.VariationOptionId))
                                    .Any(pi => pi.QtyInStock > 0)
                            })
                            .DistinctBy(opt => opt.Value)
                            .ToList()
                    })
                    .ToList();

                productDetail.VariantGroups = variantGroups;
            }

            return productDetail;
        }
    }
}