using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Application.Common.DTOs.Product;

public class CreateProductVariantDto
{
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string SKU { get; set; } = string.Empty;
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
    
    [Required]
    public List<ProductAttributeDto> Attributes { get; set; } = new List<ProductAttributeDto>();
}

public class UpdateProductVariantDto
{
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string SKU { get; set; } = string.Empty;
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
    
    [Required]
    public List<ProductAttributeDto> Attributes { get; set; } = new List<ProductAttributeDto>();
}

public class ProductVariantDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public List<ProductAttributeDto> Attributes { get; set; } = new List<ProductAttributeDto>();
}

public class ProductVariantDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
} 