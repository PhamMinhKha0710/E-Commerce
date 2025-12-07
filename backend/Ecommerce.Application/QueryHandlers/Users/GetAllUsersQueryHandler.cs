using Ecommerce.Application.Common.DTOs.User;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.QueryHandlers.Users;

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, AdminUserListResponseDto>
{
    private readonly IUserRepository _userRepository;

    public GetAllUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<AdminUserListResponseDto> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _userRepository.GetAllQueryable()
            .AsQueryable();

        // Filter by keyword (search in name, email)
        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.Trim().ToLower();
            query = query.Where(u =>
                (u.FirstName + " " + u.LastName).ToLower().Contains(keyword) ||
                u.Email.ToLower().Contains(keyword) ||
                (u.PhoneNumber != null && u.PhoneNumber.ToLower().Contains(keyword))
            );
        }

        // Filter by role
        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            var role = request.Role.Trim().ToLower();
            query = query.Where(u => u.Role.ToLower() == role);
        }

        // Filter by status
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            var status = request.Status.Trim().ToLower();
            if (status == "hoạt động" || status == "active")
            {
                query = query.Where(u => !u.IsLocked);
            }
            else if (status == "bị khóa" || status == "locked")
            {
                query = query.Where(u => u.IsLocked);
            }
        }

        var total = await query.CountAsync(cancellationToken);

        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = users.Select(MapToListItem).ToList();

        return new AdminUserListResponseDto
        {
            Users = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    private static AdminUserListItemDto MapToListItem(Domain.Entities.User user)
    {
        var fullName = $"{user.FirstName} {user.LastName}".Trim();
        var initials = GetInitials(user.FirstName, user.LastName);
        var status = user.IsLocked ? "Bị khóa" : "Hoạt động";
        
        // Map role to Vietnamese
        var role = user.Role switch
        {
            "Admin" or "Administrator" => "Quản trị viên",
            "Seller" => "Người bán",
            "User" or _ => "Khách hàng"
        };

        return new AdminUserListItemDto
        {
            Id = user.Id,
            Name = fullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Role = role,
            Status = status,
            LastActive = user.LastActive,
            CreatedAt = user.CreatedAt,
            AvatarUrl = user.AvatarUrl,
            Initials = initials
        };
    }

    private static string GetInitials(string? firstName, string? lastName)
    {
        var first = string.IsNullOrWhiteSpace(firstName) ? "" : firstName.Trim().Substring(0, 1).ToUpper();
        var last = string.IsNullOrWhiteSpace(lastName) ? "" : lastName.Trim().Substring(0, 1).ToUpper();
        return first + last;
    }
}






























