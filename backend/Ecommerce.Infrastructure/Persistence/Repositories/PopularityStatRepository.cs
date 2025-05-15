// // Ecommerce.Infrastructure/Repositories/PopularityStatRepository.cs
// using Ecommerce.Application.Interfaces.Repositories;
// using Ecommerce.Domain.Entities;
// using Ecommerce.Infrastructure.Persistence;
// using Microsoft.EntityFrameworkCore;

// namespace Ecommerce.Infrastructure.Repositories;
// public class PopularityStatRepository : IPopularityStatRepository
// {
//     private readonly AppDbContext _dbContext;

//     public PopularityStatRepository(AppDbContext dbContext)
//     {
//         _dbContext = dbContext;
//     }

//     public async Task<List<Product>> GetPopularProductsAsync(int? categoryId, int limit)
//     {
//         var timePeriod = GetStartOfWeek(DateTime.UtcNow); // Lấy thứ Hai của tuần hiện tại
//     var query = _dbContext.PopularityStats
//         .Where(ps => ps.TimePeriod == timePeriod); // Lấy bản ghi PopularityStat của tuần hiện tại

//         if (categoryId.HasValue)
//         {
//             query = query.Where(ps => ps.CategoryId == categoryId.Value);
//         }

//         query = query.OrderByDescending(ps => ps.ViewCount * 0.4 + ps.PurchaseCount * 0.6);

//         var products = await query
//             .Take(limit)
//             .Select(ps => ps.Product)
//             .ToListAsync();

//         if (!products.Any())
//         {
//             products = await _dbContext.Products
//                 .Include(p => p.ProductItems.Where(pi => pi.IsDefault))
//                 .Where(p => categoryId == null || p.ProductCategoryId == categoryId)
//                 .OrderByDescending(p => p.ProductItems.FirstOrDefault().Price)
//                 .Take(limit)
//                 .ToListAsync();
//         }

//         return products;
//     }

//     // Hàm tính ngày thứ Hai của tuần
//     private static DateTime GetStartOfWeek(DateTime date)
//     {
//         int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
//         return date.AddDays(-diff).Date; // Trả về 00:00:00 của thứ Hai
//     }   
// }

using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class PopularityStatRepository : IPopularityStatRepository
    {
        private readonly AppDbContext _dbContext;

        public PopularityStatRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Product>> GetPopularProductsAsync(int? categoryId, int limit)
        {
            // Lấy TimePeriod của tuần hiện tại và tuần trước
            var currentWeek = GetStartOfWeek(DateTime.UtcNow);
            var previousWeek = GetStartOfWeek(DateTime.UtcNow.AddDays(-7));

            // Truy vấn tuần hiện tại và tuần trước cùng lúc
            var query = _dbContext.PopularityStats
                .Where(ps => ps.TimePeriod == currentWeek || ps.TimePeriod == previousWeek);

            if (categoryId.HasValue)
            {
                query = query.Where(ps => ps.CategoryId == categoryId.Value);
            }

            // Sắp xếp theo điểm phổ biến và ưu tiên tuần hiện tại
            query = query.OrderByDescending(ps => ps.TimePeriod == currentWeek ? 1 : 0)
                         .ThenByDescending(ps => ps.ViewCount * 0.4 + ps.PurchaseCount * 0.6);

            // Lấy top 20 để chọn ngẫu nhiên
            var topProducts = await query
                .Take(20)
                .Select(ps => ps.Product)
                .Distinct()
                .ToListAsync();

            // Sắp xếp ngẫu nhiên để tăng đa dạng
            var random = new Random();
            var products = topProducts
                .OrderBy(_ => random.Next())
                .Take(limit)
                .ToList();

            if (!products.Any())
            {
                // Fallback sang Products
                products = await _dbContext.Products
                    .Include(p => p.ProductItems.Where(pi => pi.IsDefault))
                    .Where(p => categoryId == null || p.ProductCategoryId == categoryId)
                    .OrderByDescending(p => p.ProductItems.FirstOrDefault().Price)
                    .Take(limit)
                    .ToListAsync();
            }

            return products;
        }

        private static DateTime GetStartOfWeek(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-diff).Date;
        }
    }
}