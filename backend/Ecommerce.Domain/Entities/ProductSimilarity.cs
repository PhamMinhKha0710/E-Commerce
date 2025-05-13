using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Entities;

public class ProductSimilarity {
    public int Id {get; set;}
    public int ProductId1 {get; set;}
    public int ProductId2 {get; set;}
    public double Similarity {get; set;}
    public Product Product1 {get; set;}
    public Product Product2 {get; set;}
}