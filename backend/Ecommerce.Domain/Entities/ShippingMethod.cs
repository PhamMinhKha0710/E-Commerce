namespace Ecommerce.Domain.Entities;
public class ShippingMethod
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<ShopOrder> ShopOrders { get; set; } = new List<ShopOrder>();
}