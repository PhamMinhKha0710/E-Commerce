namespace Ecommerce.Domain.Entities;

public class PaymentMethod
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public List<Payment> Payments { get; set; }
}
