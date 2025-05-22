using System.Collections.Generic;

namespace Ecommerce.Application.Common.DTOs.Product;

public class AdminProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public string SKU { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public string Category { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public bool HasVariations { get; set; }
    public List<string> Images { get; set; } = new List<string>();
    public List<AdminProductAttributeDto> Attributes { get; set; } = new List<AdminProductAttributeDto>();
    public List<AdminProductVariantDto> Variants { get; set; } = new List<AdminProductVariantDto>();
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public int Sales { get; set; }
    public decimal Rating { get; set; }
    public int Reviews { get; set; }
}

public class AdminProductAttributeDto
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public class AdminProductVariantDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string SKU { get; set; } = string.Empty;
    public List<AdminProductAttributeDto> Attributes { get; set; } = new List<AdminProductAttributeDto>();
} 