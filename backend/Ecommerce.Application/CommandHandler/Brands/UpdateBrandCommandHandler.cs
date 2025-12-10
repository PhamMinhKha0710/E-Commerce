using Ecommerce.Application.Commands.Brands;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Brands;

public class UpdateBrandCommandHandler : IRequestHandler<UpdateBrandCommand, BrandDto>
{
    private readonly IBrandRepository _brandRepository;

    public UpdateBrandCommandHandler(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<BrandDto> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
    {
        // Get existing brand
        var existingBrand = await _brandRepository.GetBrandByIdAsync(request.Id);
        if (existingBrand == null)
        {
            throw new Exception($"Không tìm thấy thương hiệu với ID {request.Id}");
        }

        // Check if name already exists (but not for this brand)
        if (existingBrand.Name != request.BrandDto.Name && 
            await _brandRepository.BrandExistsAsync(request.BrandDto.Name))
        {
            throw new Exception($"Thương hiệu với tên '{request.BrandDto.Name}' đã tồn tại");
        }

        // Update brand properties
        existingBrand.Name = request.BrandDto.Name;
        if (request.BrandDto.ImageUrl != null)
        {
            existingBrand.ImageUrl = request.BrandDto.ImageUrl;
        }

        // Save changes
        var updatedBrand = await _brandRepository.UpdateBrandAsync(existingBrand);

        // Return brand DTO
        return new BrandDto
        {
            Id = updatedBrand.Id,
            Name = updatedBrand.Name,
            ImageUrl = updatedBrand.ImageUrl,
            ProductCount = updatedBrand.Products?.Count ?? 0
        };
    }
} 