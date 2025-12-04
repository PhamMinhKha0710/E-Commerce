using Serilog;
using Serilog.Events;

namespace Ecommerce.Api.Extensions;

/// <summary>
/// Extension methods cho Serilog configuration
/// </summary>
public static class SerilogExtensions
{
    /// <summary>
    /// Log khi application khởi động
    /// </summary>
    public static void LogApplicationStart(this WebApplication app)
    {
        Log.Information("========================================");
        Log.Information("Application: {ApplicationName}", app.Environment.ApplicationName);
        Log.Information("Environment: {EnvironmentName}", app.Environment.EnvironmentName);
        Log.Information("Content Root: {ContentRootPath}", app.Environment.ContentRootPath);
        Log.Information("Started at: {StartTime} (UTC)", DateTime.UtcNow);
        Log.Information("========================================");
    }

    /// <summary>
    /// Log khi application dừng
    /// </summary>
    public static void LogApplicationShutdown()
    {
        Log.Information("========================================");
        Log.Information("Application shutting down at: {StopTime} (UTC)", DateTime.UtcNow);
        Log.Information("========================================");
        Log.CloseAndFlush();
    }

    /// <summary>
    /// Cấu hình Serilog request logging với custom options
    /// </summary>
    public static IApplicationBuilder UseCustomSerilogRequestLogging(this IApplicationBuilder app)
    {
        return app.UseSerilogRequestLogging(options =>
        {
            // Customize message template
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";

            // Enrich with additional properties
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
                diagnosticContext.Set("RemoteIpAddress", httpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown");
                diagnosticContext.Set("ResponseContentType", httpContext.Response.ContentType);
                diagnosticContext.Set("RequestId", httpContext.Items["RequestId"]?.ToString() ?? "Unknown");
                
                // User info nếu đã đăng nhập
                if (httpContext.User?.Identity?.IsAuthenticated == true)
                {
                    diagnosticContext.Set("UserId", httpContext.User.Identity.Name ?? "Unknown");
                    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "userId");
                    if (userIdClaim != null)
                    {
                        diagnosticContext.Set("UserIdClaim", userIdClaim.Value);
                    }
                }
            };

            // Custom log level
            options.GetLevel = (httpContext, elapsed, ex) =>
            {
                if (ex != null) return LogEventLevel.Error;
                if (httpContext.Response.StatusCode > 499) return LogEventLevel.Error;
                if (httpContext.Response.StatusCode > 399) return LogEventLevel.Warning;
                if (elapsed > 5000) return LogEventLevel.Warning; // Slow requests
                return LogEventLevel.Information;
            };
        });
    }

    /// <summary>
    /// Helper method để log với context
    /// </summary>
    public static Serilog.ILogger ForContext<T>(this Serilog.ILogger logger)
    {
        return logger.ForContext("SourceContext", typeof(T).FullName);
    }

    /// <summary>
    /// Helper method để log performance
    /// </summary>
    public static IDisposable LogPerformance(this Serilog.ILogger logger, string operationName)
    {
        return new PerformanceLogger(logger, operationName);
    }

    private class PerformanceLogger : IDisposable
    {
        private readonly Serilog.ILogger _logger;
        private readonly string _operationName;
        private readonly System.Diagnostics.Stopwatch _stopwatch;

        public PerformanceLogger(Serilog.ILogger logger, string operationName)
        {
            _logger = logger;
            _operationName = operationName;
            _stopwatch = System.Diagnostics.Stopwatch.StartNew();
            _logger.Information("Starting operation: {OperationName}", _operationName);
        }

        public void Dispose()
        {
            _stopwatch.Stop();
            _logger.Information(
                "Completed operation: {OperationName} in {ElapsedMs:0.0000} ms",
                _operationName,
                _stopwatch.Elapsed.TotalMilliseconds
            );
        }
    }
}

