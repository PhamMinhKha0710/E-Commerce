namespace Ecommerce.Domain.Entities;
public class ProductItem
{
    public int Id { get; set; }
    public int QtyInStock { get; set; }
    public decimal OldPrice { get; set; }
    public decimal Price { get; set; }
    public string SKU { get; set; } 
    public string ImageUrl { get; set; } 

    public bool IsDefault { get; set; }
    public bool IsStatus { get; set; }
    public bool Priority { get; set; }
    public int Sold { get; set; }

    // Khóa ngoại
    public int ProductId { get; set; }

    // Navigation property
    public Product Product { get; set; } 
    public List<ProductConfiguration> ProductConfigurations { get; set; } 
    public List<ShoppingCartItem> ShoppingCartItems { get; set; } 
    public List<OrderLine> OrderLines { get; set; } 
}