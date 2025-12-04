using System.Net;
using System.Text.Json;
using Serilog;

namespace Ecommerce.Api.Middleware;

/// <summary>
/// Middleware để catch và xử lý tất cả exceptions chưa được xử lý
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        IHostEnvironment environment)
    {
        _next = next;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var requestId = context.Items["RequestId"]?.ToString() ?? Guid.NewGuid().ToString();
        var userId = context.User?.Identity?.Name ?? "Anonymous";

        // Log exception với đầy đủ thông tin
        Log.Error(exception,
            "Unhandled exception occurred. RequestId: {RequestId}, UserId: {UserId}, Path: {Path}, Method: {Method}",
            requestId,
            userId,
            context.Request.Path,
            context.Request.Method
        );

        // Tạo error response
        var statusCode = GetStatusCode(exception);
        var response = new ErrorResponse
        {
            Status = statusCode,
            Message = GetErrorMessage(exception),
            TraceId = requestId,
            Timestamp = DateTime.UtcNow,
            Path = context.Request.Path
        };

        // Chỉ hiển thị stack trace trong Development environment
        if (_environment.IsDevelopment())
        {
            response.Detail = exception.ToString();
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        });

        await context.Response.WriteAsync(jsonResponse);
    }

    private static int GetStatusCode(Exception exception)
    {
        return exception switch
        {
            ArgumentNullException => (int)HttpStatusCode.BadRequest,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            InvalidOperationException => (int)HttpStatusCode.BadRequest,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            NotImplementedException => (int)HttpStatusCode.NotImplemented,
            TimeoutException => (int)HttpStatusCode.RequestTimeout,
            _ => (int)HttpStatusCode.InternalServerError
        };
    }

    private static string GetErrorMessage(Exception exception)
    {
        return exception switch
        {
            ArgumentNullException => "Thiếu tham số bắt buộc",
            ArgumentException => "Tham số không hợp lệ",
            InvalidOperationException => exception.Message,
            UnauthorizedAccessException => "Không có quyền truy cập",
            KeyNotFoundException => "Không tìm thấy tài nguyên",
            NotImplementedException => "Tính năng chưa được triển khai",
            TimeoutException => "Yêu cầu hết thời gian chờ",
            _ => "Đã xảy ra lỗi nội bộ. Vui lòng thử lại sau."
        };
    }
}

/// <summary>
/// Model cho error response
/// </summary>
public class ErrorResponse
{
    public int Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public string TraceId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Path { get; set; } = string.Empty;
    public string? Detail { get; set; }
}

/// <summary>
/// Extension method để đăng ký GlobalExceptionMiddleware
/// </summary>
public static class GlobalExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<GlobalExceptionMiddleware>();
    }
}


