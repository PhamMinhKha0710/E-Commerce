using Ecommerce.Application.Commands;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;

namespace Ecommerce.Application.CommandHandler;

public class AddViewHistoryCommandHandler : IRequestHandler<AddViewHistoryCommand, bool>
{
    private readonly IUserViewHistoryRepository _userViewHistoryRepository;
    private readonly IProductRepository _productRepository;
    public AddViewHistoryCommandHandler(IUserViewHistoryRepository userViewHistoryRepository, IProductRepository productRepository)
    {
        _userViewHistoryRepository = userViewHistoryRepository;
        _productRepository = productRepository;
    }

    public async Task<bool> Handle(AddViewHistoryCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(request.ProductId);
        if (product == null)
            return false;
        
        // chỉ lưu nếu có userId (Người dùng đã đăng nhập)
        if(!request.UserId.HasValue)
            return false;

        // Thêm bản ghi mới
        var viewHistory = new UserViewHistory
        {
            UserId = request.UserId.Value,
            ProductId = request.ProductId,
            ViewTime = DateTime.UtcNow,
        };

        // Giới hạn 50 sản phẩm
        var userViews = await _userViewHistoryRepository.GetViewedProductIdsAsync(request.UserId.Value);
        if(userViews.Count >= 50)
        {
            // Xoá bản ghi cũ nhất
            var oldestView = await _userViewHistoryRepository.GetOldestViewAsync(request.UserId.Value);
            if (oldestView != null)
                await _userViewHistoryRepository.DeleteAsync(oldestView.Id);
        }

        await _userViewHistoryRepository.AddAsync(viewHistory);
        return true;
    }
}