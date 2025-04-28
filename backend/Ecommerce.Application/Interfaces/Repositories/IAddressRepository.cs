using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IAddressRepository
{
    Task<List<Address>> GetAddressesByUserIdAsync(int userId);
    Task<Address?> GetAddressByIdAsync(int addressId); 
    Task AddAddressAsync(Address address);
    Task AddUserAddressAsync(UserAddress userAddress);
    Task UpdateAddressAsync(Address address);
    Task DeleteAddressAsync(int addressId);
    Task<UserAddress?> GetUserAddressAsync(int userId, int addressId);
    Task UpdateUserAddressAsync(UserAddress userAddress);
    Task<List<UserAddress>> GetUserAddressesByUserIdAsync(int userId);
    Task<List<UserAddress>> GetUserAddressesByAddressIdAsync(int addressId); 
    Task DeleteUserAddressAsync(int userId, int addressId);
    Task<UserAddress?> GetDefaultAddressAsync(int userId);
}