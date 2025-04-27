namespace Ecommerce.Application.Common.DTOs;
public class ProductDetailDto
{
    public int ProductId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal OldPrice { get; set; }
    public string Currency { get; set; } = "VND";
    public string Availability { get; set; } = "InStock";
    public SellerDto Seller { get; set; } = new SellerDto();
    public List<string> Images { get; set; } = new List<string>();
    public bool HasVariations { get; set; }
    public string? DefaultCombinationId { get; set; }
    public List<VariantGroupDto> VariantGroups { get; set; } = new List<VariantGroupDto>();
}

public class SellerDto
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
}

public class VariantGroupDto
{
    public string Name { get; set; } = string.Empty;
    public List<VariantOptionDto> Options { get; set; } = new List<VariantOptionDto>();
}

public class VariantOptionDto
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public bool Available { get; set; }
}