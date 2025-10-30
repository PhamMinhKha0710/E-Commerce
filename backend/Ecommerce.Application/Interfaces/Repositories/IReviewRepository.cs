using Ecommerce.Domain.Entities;

namespace Ecommerce.Application.Interfaces.Repositories;

public interface IReviewRepository
{
    Task<(List<UserReview> reviews, int totalCount)> GetAllReviewsAsync(int page, int pageSize);
    Task<UserReview?> GetReviewByIdAsync(int reviewId);
    Task<bool> UpdateReviewStatusAsync(int reviewId, bool isStatus);
    Task<bool> DeleteReviewAsync(int reviewId);
}


