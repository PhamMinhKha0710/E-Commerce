namespace Ecommerce.Domain.Entities;
public class PaymentType
{
    public int Id { get; set; }
    public string Value { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public List<UserPaymentMethod> UserPaymentMethods { get; set; } = new List<UserPaymentMethod>();
}