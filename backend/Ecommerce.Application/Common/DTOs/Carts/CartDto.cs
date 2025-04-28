namespace Ecommerce.Application.Common.DTOs;

public class CartDto
{
    public List<CartItemDto> CartItem { get; set; } = new List<CartItemDto>();
}
