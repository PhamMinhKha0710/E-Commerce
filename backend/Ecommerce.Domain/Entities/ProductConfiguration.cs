namespace Ecommerce.Domain.Entities;
public class ProductConfiguration
    {
    // Khóa ngoại + Khóa chính
    public int ProductItemId { get; set; }
    public int VariationOptionId { get; set; }

    // Navigation property
    public ProductItem ProductItem { get; set; }
    public VariationOption VariationOption { get; set; }
}