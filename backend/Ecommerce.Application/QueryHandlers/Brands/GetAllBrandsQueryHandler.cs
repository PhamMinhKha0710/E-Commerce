using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Brands;
using MediatR;

namespace Ecommerce.Application.QueryHandlers.Brands;

public class GetAllBrandsQueryHandler : IRequestHandler<GetAllBrandsQuery, List<BrandDto>>
{
    private readonly IBrandRepository _brandRepository;

    public GetAllBrandsQueryHandler(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<List<BrandDto>> Handle(GetAllBrandsQuery request, CancellationToken cancellationToken)
    {
        var brands = await _brandRepository.GetAllBrandsAsync();

        return brands.Select(b => new BrandDto
        {
            Id = b.Id,
            Name = b.Name,
            ImageUrl = b.ImageUrl,
            ProductCount = b.Products?.Count ?? 0
        }).ToList();
    }
} 