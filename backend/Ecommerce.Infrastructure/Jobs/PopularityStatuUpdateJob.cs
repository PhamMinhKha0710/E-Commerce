using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Ecommerce.Infrastructure.Jobs
{
    public class PopularityStatUpdateJob
    {
        private readonly AppDbContext _dbContext;

        public PopularityStatUpdateJob(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task ExecuteAsync()
        {
            var timePeriod = GetStartOfWeek(DateTime.UtcNow); // Thứ Hai của tuần hiện tại
            var startOfDay = DateTime.UtcNow.Date; // 00:00:00 hôm nay
            var endOfDay = startOfDay.AddDays(1); // 00:00:00 ngày mai

            // Tổng hợp ViewCount từ UserViewHistory
            var viewCounts = await _dbContext.UserViewHistories
                .Where(vh => vh.ViewTime >= startOfDay && vh.ViewTime < endOfDay)
                .GroupBy(vh => new { vh.ProductId, vh.Product.ProductCategoryId })
                .Select(g => new
                {
                    g.Key.ProductId,
                    g.Key.ProductCategoryId,
                    ViewCount = g.Count()
                })
                .ToListAsync();

            // Tổng hợp PurchaseCount từ OrderLine của đơn hàng đã thanh toán
            var purchaseCounts = await _dbContext.OrderLines
                .Include(ol => ol.ShopOrder)
                .Include(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product)
                .Where(ol => ol.ShopOrder.OrderDate >= startOfDay &&
                             ol.ShopOrder.OrderDate < endOfDay &&
                             ol.ShopOrder.Payments.Any(p => p.PaymentStatus == "Completed"))
                .GroupBy(ol => new { ProductId = ol.ProductItem.Product.Id, ol.ProductItem.Product.ProductCategoryId })
                .Select(g => new
                {
                    g.Key.ProductId,
                    g.Key.ProductCategoryId,
                    PurchaseCount = g.Sum(ol => ol.Qty)
                })
                .ToListAsync();

            // Cập nhật PopularityStat
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // Xử lý ViewCount
                    foreach (var view in viewCounts)
                    {
                        var stat = await _dbContext.PopularityStats
                            .FirstOrDefaultAsync(ps => ps.ProductId == view.ProductId &&
                                                      ps.CategoryId == view.ProductCategoryId &&
                                                      ps.TimePeriod == timePeriod);
                        if (stat != null)
                        {
                            stat.ViewCount += view.ViewCount;
                            _dbContext.PopularityStats.Update(stat);
                        }
                        else
                        {
                            stat = new PopularityStat
                            {
                                ProductId = view.ProductId,
                                CategoryId = view.ProductCategoryId,
                                ViewCount = view.ViewCount,
                                PurchaseCount = 0,
                                TimePeriod = timePeriod
                            };
                            await _dbContext.PopularityStats.AddAsync(stat);
                        }
                    }

                    // Xử lý PurchaseCount
                    foreach (var purchase in purchaseCounts)
                    {
                        var stat = await _dbContext.PopularityStats
                            .FirstOrDefaultAsync(ps => ps.ProductId == purchase.ProductId &&
                                                      ps.CategoryId == purchase.ProductCategoryId &&
                                                      ps.TimePeriod == timePeriod);
                        if (stat != null)
                        {
                            stat.PurchaseCount += purchase.PurchaseCount;
                            _dbContext.PopularityStats.Update(stat);
                        }
                        else
                        {
                            stat = new PopularityStat
                            {
                                ProductId = purchase.ProductId,
                                CategoryId = purchase.ProductCategoryId,
                                ViewCount = 0,
                                PurchaseCount = purchase.PurchaseCount,
                                TimePeriod = timePeriod
                            };
                            await _dbContext.PopularityStats.AddAsync(stat);
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        private static DateTime GetStartOfWeek(DateTime date)
        {
            int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-diff).Date;
        }
    }
}