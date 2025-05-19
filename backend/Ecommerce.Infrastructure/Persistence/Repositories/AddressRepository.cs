using Microsoft.EntityFrameworkCore;
using Ecommerce.Domain.Entities;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Infrastructure.Persistence;

namespace Ecommerce.Infrastructure.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly AppDbContext _context;

    public AddressRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Address>> GetAddressesByUserIdAsync(int userId)
    {
        return await _context.userAddresses
            .Where(ua => ua.UserId == userId)
            .Include(ua => ua.Address)
            .Select(ua => ua.Address)
            .ToListAsync();
    }

    public async Task<Address?> GetAddressByIdAsync(int addressId)
    {
        return await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == addressId);
    }

    public async Task AddAddressAsync(Address address)
    {
        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();
    }

    public async Task AddUserAddressAsync(UserAddress userAddress)
    {
        _context.userAddresses.Add(userAddress);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAddressAsync(Address address)
    {
        _context.Addresses.Update(address);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAddressAsync(int addressId)
    {
        var address = await _context.Addresses.FindAsync(addressId);
        if (address != null)
        {
            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<UserAddress?> GetUserAddressAsync(int userId, int addressId)
    {
        return await _context.userAddresses
            .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AddressId == addressId);
    }

    public async Task UpdateUserAddressAsync(UserAddress userAddress)
    {
        _context.userAddresses.Update(userAddress);
        await _context.SaveChangesAsync();
    }

    public async Task<List<UserAddress>> GetUserAddressesByUserIdAsync(int userId)
    {
        return await _context.userAddresses
            .Where(ua => ua.UserId == userId)
            .ToListAsync();
    }

    public async Task<List<UserAddress>> GetUserAddressesByAddressIdAsync(int addressId)
    {
        return await _context.userAddresses
            .Where(ua => ua.AddressId == addressId)
            .ToListAsync();
    }

    public async Task DeleteUserAddressAsync(int userId, int addressId)
    {
        var userAddress = await _context.userAddresses
            .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AddressId == addressId);
        if (userAddress != null)
        {
            _context.userAddresses.Remove(userAddress);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<UserAddress?> GetDefaultAddressAsync(int userId)
    {
        var userAddress = await _context.userAddresses
            .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.IsDefault == true);
        return userAddress;
    }
    
}