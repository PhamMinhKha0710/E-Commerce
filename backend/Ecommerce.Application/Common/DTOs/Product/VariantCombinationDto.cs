namespace Ecommerce.Application.Common.DTOs;
public class VariantCombinationDto
{
    public string Id { get; set; } = string.Empty;
    public Dictionary<string, string> Attributes { get; set; } = new Dictionary<string, string>();
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public bool Available { get; set; }
}