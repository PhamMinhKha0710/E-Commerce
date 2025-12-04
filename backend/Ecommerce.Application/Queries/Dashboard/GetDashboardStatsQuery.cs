using Ecommerce.Application.Common.DTOs.Dashboard;
using MediatR;

namespace Ecommerce.Application.Queries.Dashboard;

public class GetDashboardStatsQuery : IRequest<DashboardDataDto>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}













