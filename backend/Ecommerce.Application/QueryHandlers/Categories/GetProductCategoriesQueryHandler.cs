using MediatR;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Common.DTOs;

namespace Ecommerce.Application.Queries;

public class GetProductCategoriesQueryHandler : IRequestHandler<GetProductCategoriesQuery, List<ProductCategoryDto>>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICustomSlugHelper _slugHelper;

    public GetProductCategoriesQueryHandler(
        ICategoryRepository categoryRepository,
        IProductRepository productRepository,
        ICustomSlugHelper slugHelper)
    {
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
        _slugHelper = slugHelper;
    }

    public async Task<List<ProductCategoryDto>> Handle(GetProductCategoriesQuery request, CancellationToken cancellationToken)
    {
        // Lấy tất cả danh mục
        var categories = await _categoryRepository.GetAllAsync();

        // Lấy số lượng sản phẩm cho từng danh mục
        var productCounts = (await _productRepository.GetAllAsync())
            .GroupBy(p => p.ProductCategoryId)
            .Select(g => new { CategoryId = g.Key, Count = g.Count() })
            .ToDictionary(g => g.CategoryId, g => g.Count);

        // Ánh xạ sang DTO và xây dựng cấu trúc cây
        var categoryMap = new Dictionary<int, ProductCategoryDto>();
        var tree = new List<ProductCategoryDto>();

        foreach (var cat in categories)
        {
            var dto = new ProductCategoryDto
            {
                Id = cat.Id.ToString(),
                Name = cat.Name,
                Slug = _slugHelper.GenerateSlug(cat.Name),
                Description = cat.Description ?? string.Empty,
                Parent = cat.ParentId?.ToString(),
                Children = new List<ProductCategoryDto>(),
                ProductCount = 0,
                DisplayOrder = cat.DisplayOrder,
            };
            categoryMap[cat.Id] = dto;

            if (cat.ParentId == null)
            {
                tree.Add(dto);
            }
            else if (categoryMap.ContainsKey(cat.ParentId.Value))
            {
                categoryMap[cat.ParentId.Value].Children.Add(dto);
            }
        }

        // Tính productCount
        void CalculateProductCount(ProductCategoryDto category)
        {
            int count = productCounts.ContainsKey(int.Parse(category.Id)) ? productCounts[int.Parse(category.Id)] : 0;
            foreach (var child in category.Children)
            {
                CalculateProductCount(child);
                count += child.ProductCount;
            }
            category.ProductCount = count;
        }

        tree.ForEach(CalculateProductCount);

        // Sắp xếp theo displayOrder
        tree.Sort((a, b) => (a.DisplayOrder ?? int.MaxValue).CompareTo(b.DisplayOrder ?? int.MaxValue));
        tree.ForEach(category =>
        {
            category.Children.Sort((a, b) => (a.DisplayOrder ?? int.MaxValue).CompareTo(b.DisplayOrder ?? int.MaxValue));
        });

        return tree;
    }
}