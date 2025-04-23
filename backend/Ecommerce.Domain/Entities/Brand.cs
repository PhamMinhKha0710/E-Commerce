namespace Ecommerce.Domain.Entities;
public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;

    // Navigation properties
    public List<Product> Products { get; set; } = new List<Product>();
}