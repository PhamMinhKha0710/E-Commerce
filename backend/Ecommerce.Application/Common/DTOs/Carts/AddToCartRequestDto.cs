namespace Ecommerce.Application.Common.DTOs;
public class AddToCartRequestDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
        public List<VariationSelectionDto> SelectedVariations { get; set; } = new List<VariationSelectionDto>();
    }