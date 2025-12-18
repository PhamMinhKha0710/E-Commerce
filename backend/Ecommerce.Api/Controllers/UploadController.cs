using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<UploadController> _logger;
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

    public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [HttpPost("image")]
    [AllowAnonymous] // Có thể thêm [Authorize] nếu cần authentication
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Không có file được upload" });
            }

            // Validate file size
            if (file.Length > MaxFileSize)
            {
                return BadRequest(new { message = $"Kích thước file không được vượt quá {MaxFileSize / 1024 / 1024}MB" });
            }

            // Validate file extension
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = $"Định dạng file không hợp lệ. Chỉ chấp nhận: {string.Join(", ", AllowedExtensions)}" });
            }

            // Validate content type
            if (!file.ContentType.StartsWith("image/"))
            {
                return BadRequest(new { message = "File phải là hình ảnh" });
            }

            // Create uploads directory if it doesn't exist
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Generate URL
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var imageUrl = $"{baseUrl}/uploads/images/{fileName}";

            _logger.LogInformation("Image uploaded successfully: {FileName}", fileName);

            return Ok(new { 
                url = imageUrl,
                imageUrl = imageUrl,
                fileName = fileName,
                size = file.Length
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading image");
            return StatusCode(500, new { message = "Lỗi khi upload ảnh: " + ex.Message });
        }
    }

    [HttpDelete("image/{fileName}")]
    [AllowAnonymous] // Có thể thêm [Authorize] nếu cần authentication
    public IActionResult DeleteImage(string fileName)
    {
        try
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "images");
            var filePath = Path.Combine(uploadsFolder, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "Không tìm thấy file" });
            }

            System.IO.File.Delete(filePath);
            _logger.LogInformation("Image deleted successfully: {FileName}", fileName);

            return Ok(new { message = "Xóa ảnh thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting image");
            return StatusCode(500, new { message = "Lỗi khi xóa ảnh: " + ex.Message });
        }
    }
}




















