using Ecommerce.Application.Commands.Brands;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using MediatR;

namespace Ecommerce.Application.CommandHandler.Brands;

public class CreateBrandCommandHandler : IRequestHandler<CreateBrandCommand, BrandDto>
{
    private readonly IBrandRepository _brandRepository;

    public CreateBrandCommandHandler(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<BrandDto> Handle(CreateBrandCommand request, CancellationToken cancellationToken)
    {
        // Check if brand with the same name already exists
        if (await _brandRepository.BrandExistsAsync(request.BrandDto.Name))
        {
            throw new Exception($"Thương hiệu với tên '{request.BrandDto.Name}' đã tồn tại");
        }

        // Create new brand entity
        var brand = new Brand
        {
            Name = request.BrandDto.Name,
            ImageUrl = request.BrandDto.ImageUrl ?? string.Empty
        };

        // Add brand to database
        var createdBrand = await _brandRepository.AddBrandAsync(brand);

        // Return brand DTO
        return new BrandDto
        {
            Id = createdBrand.Id,
            Name = createdBrand.Name,
            ImageUrl = createdBrand.ImageUrl,
            ProductCount = createdBrand.Products?.Count ?? 0
        };
    }
} 