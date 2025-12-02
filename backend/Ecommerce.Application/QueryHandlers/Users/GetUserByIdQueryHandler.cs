using Ecommerce.Application.Common.DTOs.User;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Users;
using Ecommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Application.QueryHandlers.Users;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, AdminUserDetailDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IWishlistRepository _wishlistRepository;

    public GetUserByIdQueryHandler(
        IUserRepository userRepository,
        IOrderRepository orderRepository,
        IWishlistRepository wishlistRepository)
    {
        _userRepository = userRepository;
        _orderRepository = orderRepository;
        _wishlistRepository = wishlistRepository;
    }

    public async Task<AdminUserDetailDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetAllQueryable()
            .Include(u => u.UserAddresses)
                .ThenInclude(ua => ua.Address)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
        
        if (user == null)
        {
            throw new NotFoundException($"User with ID {request.UserId} not found");
        }

        // Get user statistics
        var ordersCount = await _orderRepository.GetOrdersQueryable()
            .Where(o => o.UserId == user.Id)
            .CountAsync(cancellationToken);

        var totalSpent = await _orderRepository.GetOrdersQueryable()
            .Where(o => o.UserId == user.Id && o.Payments.Any(p => p.PaymentStatus == "paid"))
            .SumAsync(o => o.OrderTotal, cancellationToken);

        var wishlistItems = await _wishlistRepository.GetByUserIdAsync(user.Id, cancellationToken);
        var wishlistCount = wishlistItems.Count;

        // Get first address if available
        var firstAddress = user.UserAddresses?.FirstOrDefault()?.Address;
        var addressString = firstAddress != null
            ? firstAddress.AddressLine
            : null;

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

        return new AdminUserDetailDto
        {
            Id = user.Id,
            Name = fullName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Role = role,
            Status = status,
            LastActive = user.LastActive,
            CreatedAt = user.CreatedAt,
            AvatarUrl = user.AvatarUrl,
            Initials = initials,
            Address = addressString,
            Bio = null, // Bio field doesn't exist in User entity, can be added later if needed
            OrdersCount = ordersCount,
            TotalSpent = totalSpent,
            WishlistCount = wishlistCount
        };
    }

    private static string GetInitials(string? firstName, string? lastName)
    {
        var first = string.IsNullOrWhiteSpace(firstName) ? "" : firstName.Trim().Substring(0, 1).ToUpper();
        var last = string.IsNullOrWhiteSpace(lastName) ? "" : lastName.Trim().Substring(0, 1).ToUpper();
        return first + last;
    }
}

