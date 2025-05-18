using Ecommerce.Application.Common;
using Ecommerce.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Persistence.Repositories;

public class ShippingMethodRepository : IShippingMethodRepository
{

    private readonly AppDbContext _context;
    public ShippingMethodRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<ShippingInfoResponeDto>> GetAllShippingMethodAsync() {
        var shippingMethods = await _context.ShippingMethods.
            Select(sm => new ShippingInfoResponeDto
            {
                ShippingId = sm.Id,
                Name = sm.Name,
                Fee = sm.Fee

            }).ToListAsync();

        return shippingMethods;
    }
}