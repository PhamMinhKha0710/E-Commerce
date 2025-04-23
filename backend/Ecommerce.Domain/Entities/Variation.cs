namespace Ecommerce.Domain.Entities;
public class Variation
{
    public int Id { get; set; }
    public string Value { get; set; } = string.Empty;
    public List<VariationOption> VariationOptions { get; set; } = new List<VariationOption>();
}