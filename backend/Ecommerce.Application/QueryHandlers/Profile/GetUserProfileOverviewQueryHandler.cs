using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.DTOs.Profile;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Profile;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.QueryHandlers.Profile;

public class GetUserProfileOverviewQueryHandler : IRequestHandler<GetUserProfileOverviewQuery, UserProfileOverviewDto>
{
    private readonly IAuthRepository _authRepository;
    private readonly IAddressRepository _addressRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<GetUserProfileOverviewQueryHandler> _logger;

    public GetUserProfileOverviewQueryHandler(
        IAuthRepository authRepository,
        IAddressRepository addressRepository,
        IOrderRepository orderRepository,
        ILogger<GetUserProfileOverviewQueryHandler> logger)
    {
        _authRepository = authRepository;
        _addressRepository = addressRepository;
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task<UserProfileOverviewDto> Handle(GetUserProfileOverviewQuery request, CancellationToken cancellationToken)
    {
        var user = await _authRepository.FindByIdAsync(request.UserId)
            ?? throw new KeyNotFoundException("User not found");

        var defaultUserAddress = await _addressRepository.GetDefaultAddressAsync(request.UserId);
        ProfileAddressDto? defaultAddressDto = null;
        if (defaultUserAddress != null)
        {
            var address = await _addressRepository.GetAddressByIdAsync(defaultUserAddress.AddressId);
            if (address != null)
            {
                defaultAddressDto = new ProfileAddressDto
                {
                    AddressId = address.Id,
                    RecipientName = address.Name,
                    Phone = address.Phone,
                    AddressLine = address.AddressLine,
                    IsDefault = defaultUserAddress.IsDefault
                };
            }
        }

        var ordersQuery = _orderRepository
            .GetOrdersQueryable()
            .Where(o => o.UserId == request.UserId)
            .Include(o => o.OrderLines)
                .ThenInclude(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product)
            .Include(o => o.OrderStatusHistories)
                .ThenInclude(h => h.OrderStatus)
            .OrderByDescending(o => o.OrderDate);

        var orders = await ordersQuery.ToListAsync(cancellationToken);

        var stats = BuildStats(orders);
        var recentOrders = orders
            .Take(5)
            .Select(o => new ProfileOrderSummaryDto
            {
                OrderId = o.Id,
                OrderNumber = o.OrderNumber,
                OrderDate = o.OrderDate,
                OrderTotal = o.OrderTotal,
                Status = ResolveStatus(o),
                Items = o.OrderLines.Select(line => new ProfileOrderLineDto
                {
                    ProductName = line.ProductItem?.Product?.Name ?? "Sản phẩm",
                    Quantity = line.Qty,
                    LineTotal = line.Price * line.Qty,
                    ImageUrl = line.ProductItem?.ImageUrl
                }).ToList()
            })
            .ToList();

        _logger.LogInformation("Built profile overview for user {UserId} with {OrderCount} orders", request.UserId, orders.Count);

        return new UserProfileOverviewDto
        {
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FirstName = user.FirstName,
                LastName = user.LastName,
                AvatarUrl = user.AvatarUrl,
                IsVerified = user.IsVerified,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                LastActive = user.LastActive,
                IsLocked = user.IsLocked
            },
            Stats = stats,
            DefaultAddress = defaultAddressDto,
            RecentOrders = recentOrders
        };
    }

    private static ProfileStatsDto BuildStats(List<Domain.Entities.ShopOrder> orders)
    {
        var stats = new ProfileStatsDto
        {
            TotalOrders = orders.Count,
            TotalSpent = orders.Sum(o => o.OrderTotal)
        };

        foreach (var order in orders)
        {
            var status = ResolveStatus(order).ToLowerInvariant();

            if (status.Contains("cancel") || status.Contains("fail"))
            {
                stats.CancelledOrders++;
            }
            else if (status.Contains("ship") || status.Contains("delivery") || status.Contains("transport"))
            {
                stats.ShippingOrders++;
            }
            else if (status.Contains("complete") || status.Contains("done") || status.Contains("success") || status.Contains("delivered"))
            {
                stats.CompletedOrders++;
            }
            else
            {
                stats.PendingOrders++;
            }
        }

        return stats;
    }

    private static string ResolveStatus(Domain.Entities.ShopOrder order)
    {
        var latestStatus = order.OrderStatusHistories?
            .OrderByDescending(h => h.CreateAt)
            .FirstOrDefault()?.OrderStatus?.Status;

        return string.IsNullOrWhiteSpace(latestStatus) ? "Pending" : latestStatus;
    }
}

