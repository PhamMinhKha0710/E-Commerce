namespace Ecommerce.Domain.Entities;

public class UserViewHistory {
    public int Id {get; set;}
    public int UserId { get; set; }
    public int ProductId {get; set;}
    public DateTime ViewTime {get; set;}
    public User User {get; set;}
    public Product Product {get; set;}
}