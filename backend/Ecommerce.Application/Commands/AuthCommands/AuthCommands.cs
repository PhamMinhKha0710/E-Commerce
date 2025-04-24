
using Ecommerce.Application.Common.DTOs;

namespace Ecommerce.Application.Commands;

public record RegisterCommand(RegisterDto RegisterDto);
public record LoginCommand(LoginDto LoginDto);
public record VerifyOtpCommand(VerifyOtpDto VerifyOtpDto);
public record LogoutCommand(string RefreshToken);
public record SendOtpCommand(string Email);