namespace Ecommerce.Application.Common.DTOs;
public class UpdateCartItemRequestDto
{
    public int CartItemId { get; set; }
    public int Quantity { get; set; }
    public List<VariationSelectionDto> SelectedVariations { get; set; } = new List<VariationSelectionDto>();
}