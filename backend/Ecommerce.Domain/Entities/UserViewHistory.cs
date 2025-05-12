namespace Ecommerce.Domain.Entities;

public class UserViewHistory {
    public int UserId { get; set; }
    public int ProductId {get; set;}

    public User User {get; set;}
    public Product Product {get; set;}
}