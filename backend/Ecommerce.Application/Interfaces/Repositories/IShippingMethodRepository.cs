using Ecommerce.Application.Common;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IShippingMethodRepository
{
    Task<List<ShippingInfoResponeDto>> GetAllShippingMethodAsync();
}