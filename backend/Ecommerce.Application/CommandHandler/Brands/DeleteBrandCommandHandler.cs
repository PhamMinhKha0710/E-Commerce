using Ecommerce.Application.Commands.Brands;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Brands;

public class DeleteBrandCommandHandler : IRequestHandler<DeleteBrandCommand, bool>
{
    private readonly IBrandRepository _brandRepository;

    public DeleteBrandCommandHandler(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<bool> Handle(DeleteBrandCommand request, CancellationToken cancellationToken)
    {
        // Get existing brand
        var existingBrand = await _brandRepository.GetBrandByIdAsync(request.Id);
        if (existingBrand == null)
        {
            throw new Exception($"Không tìm thấy thương hiệu với ID {request.Id}");
        }

        // Check if brand has products
        if (existingBrand.Products != null && existingBrand.Products.Count > 0)
        {
            throw new Exception("Không thể xóa thương hiệu khi vẫn có sản phẩm liên kết");
        }

        // Delete brand
        return await _brandRepository.DeleteBrandAsync(request.Id);
    }
} 