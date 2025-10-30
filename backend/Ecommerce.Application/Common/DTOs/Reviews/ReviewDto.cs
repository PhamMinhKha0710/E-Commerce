namespace Ecommerce.Application.Common.DTOs.Reviews;

public class ReviewDto
{
    public int Id { get; set; }
    public int RatingValue { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public bool IsStatus { get; set; }
    public UserMinimalDto User { get; set; } = new();
    public ProductMinimalDto Product { get; set; } = new();
    public OrderMinimalDto Order { get; set; } = new();
}

public class ReviewDetailDto : ReviewDto
{
    public int HelpfulCount { get; set; }
    public int UnhelpfulCount { get; set; }
    public bool IsVerifiedPurchase { get; set; }
    public List<ReviewReplyDto> Replies { get; set; } = new();
}

public class UserMinimalDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class ProductMinimalDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class OrderMinimalDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
}

public class ReviewReplyDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public bool IsAdmin { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public bool Edited { get; set; }
    public DateTime? EditDate { get; set; }
}

public class ReviewsListDto
{
    public List<ReviewDto> Reviews { get; set; } = new();
    public int TotalCount { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class CreateReplyDto
{
    public string Content { get; set; } = string.Empty;
}

public class UpdateReplyDto
{
    public string Content { get; set; } = string.Empty;
}

public class UpdateReviewStatusDto
{
    public bool IsStatus { get; set; }
}


