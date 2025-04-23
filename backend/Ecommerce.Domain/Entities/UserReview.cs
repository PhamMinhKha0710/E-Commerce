namespace Ecommerce.Domain.Entities;
public class UserReview
{
    public int Id { get; set; }
    public int RatingValue { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public bool IsStatus { get; set; }

    // Khóa ngoại
    public int UserId { get; set; }
    public int OrderLineId { get; set; }

    // Navigation property
    public User User { get; set; }
    public OrderLine OrderLine { get; set; }
}