using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Domain.Entities;
using Ecommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Payment> GetPaymentByIdAsync(int paymentId)
        {
            return await _context.payments
                .Include(p => p.PaymentMethod)
                .Include(p => p.PaymentLogs)
                .FirstOrDefaultAsync(p => p.Id == paymentId);
        }

        public async Task<Payment> GetPaymentByTransactionIdAsync(string transactionId)
        {
            return await _context.payments
                .Include(p => p.PaymentMethod)
                .Include(p => p.PaymentLogs)
                .FirstOrDefaultAsync(p => p.TransactionId == transactionId);
        }

        public async Task<List<Payment>> GetPaymentsByOrderIdAsync(int orderId)
        {
            return await _context.payments
                .Include(p => p.PaymentMethod)
                .Include(p => p.PaymentLogs)
                .Where(p => p.ShopOrderId == orderId)
                .ToListAsync();
        }

        public async Task CreatePaymentAsync(Payment payment)
        {
            await _context.payments.AddAsync(payment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePaymentAsync(Payment payment)
        {
            _context.payments.Update(payment);
            await _context.SaveChangesAsync();
        }

        public async Task CreatePaymentLogAsync(PaymentLog paymentLog)
        {
            await _context.paymentLogs.AddAsync(paymentLog);
            await _context.SaveChangesAsync();
        }

        public async Task<List<PaymentLog>> GetPaymentLogsByPaymentIdAsync(int paymentId)
        {
            return await _context.paymentLogs
                .Where(l => l.PaymentId == paymentId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }
    }
}