using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Application.Common.DTOs;

public class CreateBrandDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }
    
    [StringLength(15000000)] // Allow data URLs (base64) up to ~10MB, regular URLs, or empty
    public string? ImageUrl { get; set; }
} 