namespace Ecommerce.Application.Common.DTOs;

public class SyncCartRequestDto
{
    public List<CartItemDto> LocalCartItems { get; set; } = new List<CartItemDto>();
}