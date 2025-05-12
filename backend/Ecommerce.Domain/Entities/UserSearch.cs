using Ecommerce.Domain.Entities;

namespace Ecommerce.Domain.Entitie;

public class UserSearch {
    public int Id { get; set;}

    public string keyWord {get; set;}
    public DateTime SearchTime { get; set;}
    public int UserId { get; set;}
    public User User {get; set;}
}