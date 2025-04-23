namespace Ecommerce.Application.Interfaces;
public interface IJwtTokenService
{
    string GenerateToken(int userId, string role);
}