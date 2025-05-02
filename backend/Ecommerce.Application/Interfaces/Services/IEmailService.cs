namespace Ecommerce.Application.Interfaces;
public interface IEmailService
{
    Task SendOtpEmailAsync(string email, string otp);
    Task SendPaymentConfirmationEmailAsync(string email, decimal amount, string orderId);
}
