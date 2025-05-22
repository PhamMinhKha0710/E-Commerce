using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Application.Common.DTOs.Product;

public class CreateUpdateProductDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    public string? Slug { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? SalePrice { get; set; }

    public string SKU { get; set; } = string.Empty;

    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [Required]
    public string Status { get; set; } = string.Empty;

    public bool Featured { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Category is required")]
    public int CategoryId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Brand is required")]
    public int BrandId { get; set; }

    public List<string> Images { get; set; } = new List<string>();

    public List<ProductAttributeDto> Attributes { get; set; } = new List<ProductAttributeDto>();
}

public class ProductAttributeDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Value { get; set; } = string.Empty;
} 