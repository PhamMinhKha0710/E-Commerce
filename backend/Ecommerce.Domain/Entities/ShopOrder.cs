namespace Ecommerce.Domain.Entities
{
    public class ShopOrder
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal OrderTotal { get; set; }
        public decimal ShippingAmount { get; set; } = 0;
        public decimal DiscountAmount { get; set; } = 0;
        public string Note { get; set; }
        public DateTime? CreateAt {get; set;}

        // Khóa ngoại
        public int ShippingAddressId { get; set; }
        public int ShippingMethodId { get; set; }
        public int UserId { get; set; }
        public int? PromotionId {get; set;}
        // Navigation properties
        public Promotion Promotion {get; set;}
        public Address ShippingAddress { get; set; }
        public ShippingMethod ShippingMethod { get; set; }
        public User User { get; set; }
        public List<OrderStatusHistory> OrderStatusHistories { get; set; }
        public List<OrderLine> OrderLines { get; set; }
        public List<Payment> Payments { get; set; } // Quan hệ 1-nhiều
    }
}