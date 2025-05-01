using System;
using System.Collections.Generic;

namespace Ecommerce.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public int ShopOrderId { get; set; }
        public int PaymentMethodId { get; set; }
        public decimal Amount { get; set; }
        public string TransactionId { get; set; }
        public string PaymentStatus { get; set; } // Pending, Completed, Failed, COD
        public string ResponseCode { get; set; }
        public string ResponseMessage { get; set; }
        public string SecureHash { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ShopOrder ShopOrder { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public List<PaymentLog> PaymentLogs { get; set; }
    }
}