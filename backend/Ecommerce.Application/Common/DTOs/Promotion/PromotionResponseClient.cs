namespace Ecommerce.Application.Common.DTOs;

public class PromotionResponseClient
{
    public Decimal DiscountRate { get; set; }
    public decimal LimitDiscountPrice { get; set; }
    public bool IsAvailable { get; set; }

    public int RemainingQuantity { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<int> ListCartIdPromotion { get; set; }
}