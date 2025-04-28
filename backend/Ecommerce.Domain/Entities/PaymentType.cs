namespace Ecommerce.Domain.Entities;
public class PaymentType
{
    public int Id { get; set; }
    public string Value { get; set; } 
    public string Type { get; set; } 
    public List<UserPaymentMethod> UserPaymentMethods { get; set; }
}