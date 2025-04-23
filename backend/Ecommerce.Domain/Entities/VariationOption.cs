namespace Ecommerce.Domain.Entities;
public class VariationOption
{
    public int Id { get; set; }
    public string Value { get; set; } = string.Empty;

    // Khóa ngoại
    public int VariationId { get; set; }

    // Navigation property
    public Variation Variation { get; set; }
    public List<ProductConfiguration> ProductConfigurations { get; set; } = new List<ProductConfiguration>();
}