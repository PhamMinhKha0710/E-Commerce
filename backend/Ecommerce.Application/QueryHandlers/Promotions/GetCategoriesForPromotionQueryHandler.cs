using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Promotions;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Promotions;

public class GetCategoriesForPromotionQueryHandler : IRequestHandler<GetCategoriesForPromotionQuery, List<CategoryDto>>
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IProductRepository _productRepository;

    public GetCategoriesForPromotionQueryHandler(
        IPromotionRepository promotionRepository,
        IProductRepository productRepository)
    {
        _promotionRepository = promotionRepository;
        _productRepository = productRepository;
    }

    public async Task<List<CategoryDto>> Handle(GetCategoriesForPromotionQuery request, CancellationToken cancellationToken)
    {
        // Lấy tất cả danh mục
        var allCategories = await _promotionRepository.GetAllCategoriesAsync();
        
        // Lấy danh sách categoryIds có sản phẩm
        var categoriesWithProducts = (await _productRepository.GetAllAsync())
            .Select(p => p.ProductCategoryId)
            .Distinct()
            .ToHashSet();
        
        // Chỉ trả về những danh mục có sản phẩm
        var categories = allCategories
            .Where(c => categoriesWithProducts.Contains(c.Id))
            .Select(c => new CategoryDto
            {
                id = c.Id,
                title = c.Name
            })
            .ToList();
        
        return categories;
    }
} 