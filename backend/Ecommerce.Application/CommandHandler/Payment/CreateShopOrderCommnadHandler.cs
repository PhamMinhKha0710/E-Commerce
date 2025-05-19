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
        var userId = _currentUserService.GetUserId();
        if (!userId.HasValue)
        {
            _logger.LogWarning("User not authenticated");
            throw new UnauthorizedAccessException("User not authenticated");
        }

        if (!request.Request.CartPayments.Any())
        {
            _logger.LogWarning("No items selected for order");
            throw new InvalidOperationException("No items selected for order");
        }

        var shippingAddress = await _orderRepository.GetDefaultAddressAsync(userId);
        if (shippingAddress == null)
        {
            _logger.LogWarning($"No default address found for user {userId}");
            throw new InvalidOperationException("No default address found");
        }

        var shippingMethod = await _orderRepository.GetShippingMethodByIdAsync(request.Request.ShippingMethodId);
        if (shippingMethod == null)
        {
            _logger.LogWarning($"Invalid shipping method: {request.Request.ShippingMethodId}");
            throw new InvalidOperationException("Invalid shipping method");
        }

        var paymentMethod = await _orderRepository.GetPaymentMethodByNameAsync(request.Request.PaymentMethod);
        if (paymentMethod == null || !paymentMethod.IsActive)
        {
            _logger.LogWarning($"Invalid payment method: {request.Request.PaymentMethod}");
            throw new InvalidOperationException("Invalid payment method");
        }

        _logger.LogInformation("CartPayments received: {CartPayments}", JsonSerializer.Serialize(request.Request.CartPayments));
        return await _orderRepository.ExecuteInTransactionAsync<CreateOrderResponseDto>(async () =>
        {
            var orderLines = new List<OrderLine>();
            decimal orderTotal = 0;
            decimal discountAmount = 0;
            Promotion promotion = null;

            // Xử lý mã khuyến mãi
            if (!string.IsNullOrEmpty(request.Request.CodePromotion))
            {
                promotion = await _orderRepository.GetPromotionByCodeAsync(request.Request.CodePromotion);
                if (promotion == null)
                {
                    _logger.LogWarning($"Invalid promotion code: {request.Request.CodePromotion}");
                    // Không throw exception, chỉ bỏ qua mã khuyến mãi
                }
                else if (promotion.UsedQuantity >= promotion.TotalQuantity && promotion.TotalQuantity > 0)
                {
                    _logger.LogWarning($"Promotion {request.Request.CodePromotion} has reached usage limit");
                    promotion = null; // Bỏ qua nếu đã hết số lượng
                }
            }

            // Tạo OrderLines và tính tổng giá
            foreach (var item in request.Request.CartPayments)
            {
                var productItem = await _orderRepository.GetProductItemByIdAsync(item.ProductItemId);
                if (productItem == null)
                {
                    _logger.LogWarning($"Product item {item.ProductItemId} not found");
                    throw new InvalidOperationException($"Product item {item.ProductItemId} not found");
                }
                if (productItem.QtyInStock < item.Quantity)
                {
                    _logger.LogWarning($"Insufficient stock for product item {item.ProductItemId}");
                    throw new InvalidOperationException($"Insufficient stock for product {item.ProductItemId}");
                }

                var orderLine = new OrderLine
                {
                    ProductItemId = item.ProductItemId,
                    Qty = item.Quantity,
                    Price = productItem.Price,
                    OrderDate = DateTime.UtcNow
                };
                orderLines.Add(orderLine);
                orderTotal += item.Quantity * productItem.Price;

                productItem.QtyInStock -= item.Quantity;
                await _orderRepository.UpdateProductItemAsync(productItem);

                var cartItem = await _orderRepository.GetCartItemByProductItemIdAsync(userId.Value, item.ProductItemId);
                if (cartItem != null)
                {
                    cartItem.Qty -= item.Quantity;
                    if (cartItem.Qty <= 0)
                        await _orderRepository.DeleteCartItemAsync(cartItem);
                    else
                        await _orderRepository.UpdateCartItemAsync(cartItem);
                }
            }

            // Áp dụng khuyến mãi nếu hợp lệ
            if (promotion != null)
            {
                bool hasEligibleProduct = false;
                foreach (var orderLine in orderLines)
                {
                    var productItem = await _orderRepository.GetProductItemByIdAsync(orderLine.ProductItemId);
                    if (await _orderRepository.IsProductInPromotionCategoryAsync(productItem.ProductId, promotion.Id))
                    {
                        hasEligibleProduct = true;
                        break;
                    }
                }

                if (hasEligibleProduct)
                {
                    // Tính toán giảm giá
                    decimal discount = orderTotal * promotion.DiscountRate / 100;
                    if (promotion.LimitDiscountPrice > 0 && discount > promotion.LimitDiscountPrice)
                    {
                        discount = promotion.LimitDiscountPrice; // Giới hạn giảm giá tối đa
                    }
                    discountAmount = discount;
                    promotion.UsedQuantity += 1; // Tăng số lượng đã sử dụng
                    await _orderRepository.UpdatePromotionAsync(promotion);
                }
                else
                {
                    _logger.LogWarning($"No eligible products for promotion {request.Request.CodePromotion}");
                    promotion = null; // Không có sản phẩm phù hợp
                }
            }

            var orderStatus = await _orderRepository.GetOrderStatusByNameAsync("Pending");
            if (orderStatus == null)
            {
                _logger.LogWarning("Order status 'Pending' not found");
                throw new InvalidOperationException("Order status not found");
            }

            var order = new ShopOrder
            {
                OrderNumber = $"ORD-{DateTime.Now.Ticks}",
                OrderDate = DateTime.UtcNow,
                OrderTotal = orderTotal - discountAmount + shippingMethod.Fee * 1000, // Trừ giảm giá + phí ship*1000 đồng
                ShippingAmount = shippingMethod.Fee * 1000,
                DiscountAmount = discountAmount,
                Note = request.Request.Note,
                ShippingAddressId = shippingAddress.AddressId,
                ShippingMethodId = shippingMethod.Id,
                UserId = userId.Value,
                PromotionId = promotion?.Id, // Liên kết PromotionId
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
                Amount = order.OrderTotal, // Số tiền sau khi giảm giá
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
                    _logger.LogWarning("Order status 'Confirmed' not found");
                    throw new InvalidOperationException("Confirmed status not found");
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