using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Application.Common.DTOs;

public class CreateBrandDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }
    
    [Required]
    [StringLength(500)]
    [Url]
    public string ImageUrl { get; set; }
} 