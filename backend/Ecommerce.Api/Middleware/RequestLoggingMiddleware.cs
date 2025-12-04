using System.Diagnostics;
using Serilog;
using Serilog.Context;

namespace Ecommerce.Api.Middleware;

/// <summary>
/// Middleware để log tất cả HTTP requests và responses
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;
    private readonly IConfiguration _configuration;

    public RequestLoggingMiddleware(
        RequestDelegate next,
        ILogger<RequestLoggingMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Tạo hoặc lấy RequestId từ header
        var requestId = context.Request.Headers["X-Request-Id"].FirstOrDefault() 
                        ?? Guid.NewGuid().ToString();
        
        context.Items["RequestId"] = requestId;
        context.Response.Headers.Append("X-Request-Id", requestId);

        var stopwatch = Stopwatch.StartNew();

        try
        {
            // Gọi middleware tiếp theo
            await _next(context);

            stopwatch.Stop();

            // Log response - TINH GỌN
            var requestMethod = context.Request.Method;
            var requestPath = context.Request.Path;
            var statusCode = context.Response.StatusCode;
            var elapsed = stopwatch.Elapsed.TotalMilliseconds;

            // Log với RequestId để debug duplicate
            var shortRequestId = requestId.Substring(0, 8);
            
            // Chỉ log nếu là success
            if (statusCode < 400)
            {
                Log.Information(
                    "{Method} {Path} → {StatusCode} ({Elapsed}ms) [{RequestId}]",
                    requestMethod,
                    requestPath,
                    statusCode,
                    elapsed.ToString("0"),
                    shortRequestId
                );
            }
            else
            {
                Log.Warning(
                    "{Method} {Path} → {StatusCode} ({Elapsed}ms) [{RequestId}]",
                    requestMethod,
                    requestPath,
                    statusCode,
                    elapsed.ToString("0"),
                    shortRequestId
                );
            }
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            // Log exception
            Log.Error(ex,
                "{Method} {Path} → FAILED ({Elapsed}ms) - {ErrorMessage}",
                context.Request.Method,
                context.Request.Path,
                stopwatch.Elapsed.TotalMilliseconds.ToString("0"),
                ex.Message
            );

            throw; // Re-throw để GlobalExceptionMiddleware xử lý
        }
    }
}

/// <summary>
/// Extension method để đăng ký RequestLoggingMiddleware
/// </summary>
public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
}

