// Ecommerce.Application/CommandHandlers/ViewHistory/AddViewHistoryCommandHandler.cs
using Ecommerce.Application.Commands;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Interfaces.Services;
using Ecommerce.Domain.Entities;
using MediatR;

namespace Ecommerce.Application.CommandHandlers.ViewHistory;
public class AddViewHistoryCommandHandler : IRequestHandler<AddViewHistoryCommand, bool>
{
    private readonly IUserViewHistoryRepository _userViewHistoryRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICurrentUserService _currentUserService;

    public AddViewHistoryCommandHandler(
        IUserViewHistoryRepository userViewHistoryRepository,
        IProductRepository productRepository,
        ICurrentUserService currentUserService)
    {
        _userViewHistoryRepository = userViewHistoryRepository;
        _productRepository = productRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(AddViewHistoryCommand request, CancellationToken cancellationToken)
    {
        // Kiểm tra sản phẩm tồn tại
        var product = await _productRepository.GetByIdAsync(request.ProductId);
        if (product == null)
            return false;

        // Lấy UserId từ ICurrentUserService
        var userId = _currentUserService.GetUserId();
        if (!userId.HasValue)
            return true; // Không lưu nếu người dùng chưa đăng nhập

        // Thêm bản ghi mới
        var viewHistory = new UserViewHistory
        {
            UserId = userId.Value,
            ProductId = request.ProductId,
            ViewTime = DateTime.UtcNow
        };

        // Kiểm tra giới hạn 50 sản phẩm
        var userViews = await _userViewHistoryRepository.GetViewedProductIdsAsync(userId.Value);
        if (userViews.Count >= 50)
        {
            var oldestView = await _userViewHistoryRepository.GetOldestViewAsync(userId.Value);
            if (oldestView != null)
                await _userViewHistoryRepository.DeleteAsync(oldestView.Id);
        }

        // Thêm bản ghi
        await _userViewHistoryRepository.AddAsync(viewHistory);
        return true;
    }
}