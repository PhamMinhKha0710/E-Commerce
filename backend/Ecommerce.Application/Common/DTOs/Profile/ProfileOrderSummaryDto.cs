using System;
using System.Collections.Generic;

namespace Ecommerce.Application.Common.DTOs.Profile;

public class ProfileOrderSummaryDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal OrderTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<ProfileOrderLineDto> Items { get; set; } = new();
}

