using Ecommerce.Application.Commands;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Common.Utilities;
using Ecommerce.Application.Interfaces;
using Ecommerce.Domain.Entities; 
using Ecommere.Application.Common;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Application.CommandHandler;

public class LoginCommandHandler
{
    private readonly IAuthRepository _authRepository;
    private readonly TokenService _tokenService;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        IAuthRepository authRepository,
        TokenService tokenService,
        ILogger<LoginCommandHandler> logger)
    {
        _authRepository = authRepository;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<Result<LoginResponseDto>> Handle(LoginCommand command)
    {
        try
        {
            var dto = command.LoginDto;
            var user = await _authRepository.FindByEmailAsync(dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Result<LoginResponseDto>.Failure("Invalid credentials");

            if (!user.IsVerified)
                return Result<LoginResponseDto>.Failure("Email not verified");

            // Tạo access token
            var accessToken = _tokenService.GenerateAccessToken(user);

            // Kiểm tra refresh token hiện có
            var existingRefreshToken = await _authRepository.GetRefreshTokenByUserIdAsync(user.Id);
            RefreshToken refreshToken;

            if (existingRefreshToken != null)
            {
                // Cập nhật refresh token hiện có
                existingRefreshToken.Token = Guid.NewGuid().ToString(); // Tạo refresh token mới
                existingRefreshToken.ExpiresAt = DateTime.UtcNow.AddDays(7); // Ví dụ: hết hạn sau 7 ngày
                refreshToken = existingRefreshToken;

                await _authRepository.UpdateRefreshTokenAsync(refreshToken);
                _logger.LogInformation("Updated existing refresh token for user: {Email}", dto.Email);
            }
            else
            {
                // Tạo refresh token mới
                refreshToken = await _tokenService.GenerateRefreshToken(user.Id);
                await _authRepository.AddRefreshTokenAsync(refreshToken);
                _logger.LogInformation("Created new refresh token for user: {Email}", dto.Email);
            }

            return Result<LoginResponseDto>.Success(new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                ExpiresIn = 15 * 60 // 15 phút
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging in user: {Email}", command.LoginDto.Email);
            return Result<LoginResponseDto>.Failure("An error occurred while logging in");
        }
    }
}