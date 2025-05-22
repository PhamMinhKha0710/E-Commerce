using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Brands;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Brands;

public class GetBrandByIdQueryHandler : IRequestHandler<GetBrandByIdQuery, BrandDto>
{
    private readonly IBrandRepository _brandRepository;

    public GetBrandByIdQueryHandler(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<BrandDto> Handle(GetBrandByIdQuery request, CancellationToken cancellationToken)
    {
        var brand = await _brandRepository.GetBrandByIdAsync(request.Id);
        
        if (brand == null)
        {
            throw new Exception($"Không tìm thấy thương hiệu với ID {request.Id}");
        }

        return new BrandDto
        {
            Id = brand.Id,
            Name = brand.Name,
            ImageUrl = brand.ImageUrl,
            ProductCount = brand.Products?.Count ?? 0
        };
    }
} 