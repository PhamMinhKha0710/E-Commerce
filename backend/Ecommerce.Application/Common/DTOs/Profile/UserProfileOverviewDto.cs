using System.Collections.Generic;
using Ecommerce.Application.Common.DTOs;

namespace Ecommerce.Application.Common.DTOs.Profile;

public class UserProfileOverviewDto
{
    public UserDto User { get; set; } = new();
    public ProfileStatsDto Stats { get; set; } = new();
    public ProfileAddressDto? DefaultAddress { get; set; }
    public List<ProfileOrderSummaryDto> RecentOrders { get; set; } = new();
}
