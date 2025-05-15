using System.Text.Json;
using Ecommerce.Application.Command;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Interfaces.Services;
using Ecommerce.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler;

public class CreateShopOrderCommnadHandler : IRequestHandler<CreateShopOrderCommnad, CreateOrderResponseDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPaymentService _paymentService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<CreateShopOrderCommnadHandler> _logger;

    public CreateShopOrderCommnadHandler(
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository,
        ICurrentUserService currentUserService,
        IPaymentService paymentService,
        IHttpContextAccessor httpContextAccessor,
        ILogger<CreateShopOrderCommnadHandler> logger)
    {
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _currentUserService = currentUserService;
        _paymentService = paymentService;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<CreateOrderResponseDto> Handle(CreateShopOrderCommnad request, CancellationToken cancellationToken)
    {
        var UserId = _currentUserService.GetUserId();
        if (!UserId.HasValue)
        {
            _logger.LogWarning("User not authenticated - Chưa xác thực người dùng");
            throw new UnauthorizedAccessException("User not authenticated - người dùng chưa được xác thực");
        }

        if (!request.Request.CartPayments.Any())
        {
            _logger.LogWarning("No items selected for order - chưa có sản phẩm nào được chọn trong giỏ hàng");
            throw new InvalidOperationException("No items selected for order - giỏ hàng trống");
        }

        var shippingAddress = await _orderRepository.GetDefaultAddressAsync(UserId);
        if (shippingAddress == null)
        {
            _logger.LogWarning($"No default address found for user {UserId}. - người dùng chưa có địa chỉ mặc định");
            throw new InvalidOperationException("No default address found. - không có địa chỉ mặc định cho người dùng này");
        }

        var shippingMethod = await _orderRepository.GetShippingMethodByIdAsync(request.Request.ShippingMethodId);
        if (shippingMethod == null)
        {
            _logger.LogWarning($"Invalid shipping method: {request.Request.ShippingMethodId}");
            throw new InvalidOperationException("Invalid shipping method - phương thức thanh toán này chưa có");
        }

        var paymentMethod = await _orderRepository.GetPaymentMethodByNameAsync(request.Request.PaymentMethod);
        if (paymentMethod == null || !paymentMethod.IsActive)
        {
            _logger.LogWarning($"Invalid payment method - không có phương thức thanh toán hoặc chưa kích hoạt");
            throw new InvalidOperationException("Invalid payment method - không có phương thức thanh toán hoặc chưa kích hoạt");
        }
        _logger.LogInformation("CartPayments received: {CartPayments}", JsonSerializer.Serialize(request.Request.CartPayments));
        return await _orderRepository.ExecuteInTransactionAsync<CreateOrderResponseDto>(async () =>
        {
            var orderLines = new List<OrderLine>();
            decimal orderTotal = 0;

            foreach (var item in request.Request.CartPayments)
            {
                var productItem = await _orderRepository.GetProductItemByIdAsync(item.ProductItemId);
                if (productItem == null)
                {
                    _logger.LogWarning($"Product item {item.ProductItemId} not found.");
                    throw new InvalidOperationException($"Product item {item.ProductItemId} not found.");
                }
                if (productItem.QtyInStock < item.Quantity)
                {
                    _logger.LogWarning($"Insufficient stock for product item {item.ProductItemId}.");
                    throw new InvalidOperationException($"Insufficient stock for product {item.ProductItemId}.");
                }

                var orderLine = new OrderLine
                {
                    ProductItemId = item.ProductItemId,
                    Qty = item.Quantity,
                    Price = productItem.Price,
                    OrderDate = DateTime.UtcNow
                };
                orderLines.Add(orderLine);
                orderTotal += item.Quantity * item.Price;

                productItem.QtyInStock -= item.Quantity;
                await _orderRepository.UpdateProductItemAsync(productItem);

                var cartItem = await _orderRepository.GetCartItemByProductItemIdAsync(UserId.Value, item.ProductItemId);
                if (cartItem != null)
                {
                    cartItem.Qty -= item.Quantity;
                    if (cartItem.Qty <= 0)
                        await _orderRepository.DeleteCartItemAsync(cartItem);
                    else
                        await _orderRepository.UpdateCartItemAsync(cartItem);
                }
            }

            var orderStatus = await _orderRepository.GetOrderStatusByNameAsync("Pending");
            if (orderStatus == null)
            {
                _logger.LogWarning("Order status 'Pending' not found.");
                throw new InvalidOperationException("Order status not found.");
            }

            var order = new ShopOrder
            {
                OrderNumber = $"ORD-{DateTime.Now.Ticks}",
                OrderDate = DateTime.UtcNow,
                OrderTotal = orderTotal,
                ShippingAmount = 32000,
                DiscountAmount = 32000,
                Note = request.Request.Note,
                ShippingAddressId = shippingAddress.AddressId,
                ShippingMethodId = shippingMethod.Id,
                UserId = UserId.Value,
                OrderLines = orderLines,
                CreateAt = DateTime.UtcNow,
                OrderStatusHistories = new List<OrderStatusHistory>
                {
                    new OrderStatusHistory { OrderStatusId = orderStatus.Id }
                },
                Payments = new List<Payment>()
            };

            var payment = new Payment
            {
                ShopOrder = order,
                PaymentMethodId = paymentMethod.Id,
                Amount = orderTotal,
                PaymentStatus = request.Request.PaymentMethod == "COD" ? "COD" : "Pending",
                ResponseCode = "",
                ResponseMessage = "",
                SecureHash = "",
                TransactionId = $"{order.Id}-{DateTime.Now.Ticks}",
                CreatedAt = DateTime.UtcNow
            };
            order.Payments.Add(payment);

            await _orderRepository.CreateOrderAsync(order);

            string paymentUrl = string.Empty;
            if (request.Request.PaymentMethod == "VnPay")
            {
                var vnpayRequest = new VnPaymentRequestDto
                {
                    OrderId = order.Id,
                    FullName = "Customer",
                    Description = $"Thanh toán cho đơn hàng {order.OrderNumber}",
                    Amount = (double)order.OrderTotal,
                    CreatedDate = DateTime.UtcNow
                };
                paymentUrl = await _paymentService.CreatePaymentUrl(_httpContextAccessor.HttpContext, vnpayRequest);
                payment.TransactionId = vnpayRequest.OrderId.ToString();
                await _paymentRepository.UpdatePaymentAsync(payment);

                await _paymentRepository.CreatePaymentLogAsync(new PaymentLog
                {
                    PaymentId = payment.Id,
                    EventType = "PaymentInitiated",
                    Message = $"Payment initiated for order {order.OrderNumber} via VnPay",
                    Data = JsonSerializer.Serialize(vnpayRequest),
                    CreatedAt = DateTime.UtcNow
                });
            }
            else if (request.Request.PaymentMethod == "COD")
            {
                var confirmedStatus = await _orderRepository.GetOrderStatusByNameAsync("Confirmed");
                if (confirmedStatus == null)
                {
                    _logger.LogWarning("Order status 'Confirmed' not found.");
                    throw new InvalidOperationException("Confirmed status not found.");
                }
                order.OrderStatusHistories.Add(new OrderStatusHistory { OrderStatusId = confirmedStatus.Id });
                await _orderRepository.UpdateOrderAsync(order);

                await _paymentRepository.CreatePaymentLogAsync(new PaymentLog
                {
                    PaymentId = payment.Id,
                    EventType = "PaymentConfirmed",
                    Message = $"COD payment confirmed for order {order.OrderNumber}",
                    Data = "{}",
                    CreatedAt = DateTime.UtcNow
                });
            }

            return new CreateOrderResponseDto
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber,
                PaymentUrl = paymentUrl
            };
        });
    }
}