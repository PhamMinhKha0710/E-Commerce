namespace Ecommerce.Domain.Entities;
public class ShippingMethod
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<ShopOrder> ShopOrders { get; set; }
}