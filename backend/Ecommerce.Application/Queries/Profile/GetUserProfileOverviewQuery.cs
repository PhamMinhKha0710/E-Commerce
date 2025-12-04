using Ecommerce.Application.Common.DTOs.Profile;
using MediatR;

namespace Ecommerce.Application.Queries.Profile;

public class GetUserProfileOverviewQuery : IRequest<UserProfileOverviewDto>
{
    public int UserId { get; set; }
}

