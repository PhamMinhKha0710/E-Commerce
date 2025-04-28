namespace Ecommerce.Domain.Entities;
public class Variation
{
    public int Id { get; set; }
    public string Value { get; set; }
    public List<VariationOption> VariationOptions { get; set; }
}