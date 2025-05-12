
namespace Ecommerce.Domain.Entities;

public class PopularityStat {
    public int Id {get; set;}
    public int ProductId {get; set;}
    public int CategoryId {get; set;}
    public int ViewCount {get; set;}
    public int PurchaseCount {get; set;}
    public DateTime TimePeriod {get; set;}
    public Product Product {get; set;}
    public ProductCategory ProductCategory {get; set;}
}