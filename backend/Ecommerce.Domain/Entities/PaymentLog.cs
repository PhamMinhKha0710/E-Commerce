namespace Ecommerce.Domain.Entities;

public class PaymentLog
{
    public int Id { get; set; }
    public int PaymentId { get; set; }
    public string EventType { get; set; }
    public string Message { get; set; }
    public string? Data { get; set; }
    public DateTime CreatedAt { get; set; }

    public Payment Payment { get; set; }
}
