
namespace Ecommerce.Application.Common.DTOs.Promotion;

public class PromotionDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public bool IsActive { get; set; }
    public string Description { get; set; }
    public decimal DiscountRate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalQuantity { get; set; }
    public int UsedQuantity { get; set; }
    public List<int> CategoryIds { get; set; } = new List<int>();
    public List<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
    public string Status => 
        DateTime.Now < StartDate ? "Sắp diễn ra" :
        DateTime.Now > EndDate ? "Đã kết thúc" :
        IsActive ? "Đang diễn ra" : "Tạm dừng";
}

public class CreatePromotionDto
{
    public string Name { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public decimal DiscountRate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public int TotalQuantity { get; set; } = 0;
    public List<int> CategoryIds { get; set; } = new List<int>();
}

public class UpdatePromotionDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public decimal DiscountRate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public List<int> CategoryIds { get; set; } = new List<int>();
    public int TotalQuantity { get; set; } = 0;
} 