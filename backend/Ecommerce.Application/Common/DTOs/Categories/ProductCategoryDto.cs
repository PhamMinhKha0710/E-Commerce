namespace Ecommerce.Application.Common.DTOs;
public class ProductCategoryDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Parent { get; set; }
    public List<ProductCategoryDto> Children { get; set; } = new List<ProductCategoryDto>();
    public int ProductCount { get; set; }
    public int? DisplayOrder { get; set; }
}