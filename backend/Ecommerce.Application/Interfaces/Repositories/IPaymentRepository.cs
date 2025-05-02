using System.Collections.Generic;
using System.Threading.Tasks;
using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task<Payment> GetPaymentByIdAsync(int paymentId);
        Task<Payment> GetPaymentByTransactionIdAsync(string transactionId);
        Task<List<Payment>> GetPaymentsByOrderIdAsync(int orderId);
        Task CreatePaymentAsync(Payment payment);
        Task UpdatePaymentAsync(Payment payment);
        Task CreatePaymentLogAsync(PaymentLog paymentLog);
        Task<List<PaymentLog>> GetPaymentLogsByPaymentIdAsync(int paymentId);
    }
}