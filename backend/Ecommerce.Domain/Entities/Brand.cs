namespace Ecommerce.Domain.Entities;
public class Brand
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; } 

    // Navigation properties
    public List<Product> Products { get; set; } 
}