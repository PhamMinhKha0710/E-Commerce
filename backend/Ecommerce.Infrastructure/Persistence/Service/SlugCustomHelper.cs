using Ecommerce.Application.Interfaces;
using System.Text.RegularExpressions;
using Slugify; 

namespace Ecommerce.Infrastructure.Services;

public class SlugCustomHelper : ICustomSlugHelper
{
    private readonly SlugHelper _slugHelper;

    public SlugCustomHelper()
    {
        _slugHelper = new SlugHelper(); 
    }

    public string GenerateSlug(string input)
    {
        // Thay thế ký tự đặc biệt trước khi gọi GenerateSlug
        input = input.Replace("&", "va");

        // Gọi GenerateSlug từ Slugify.Core
        var slug = _slugHelper.GenerateSlug(input);

        // Tùy chỉnh thêm: Chỉ cho phép a-z, 0-9, và dấu gạch nối
        var regex = new Regex(@"[^a-z0-9\-]");
        slug = regex.Replace(slug, "");

        // Gộp nhiều dấu gạch nối thành một
        slug = Regex.Replace(slug, @"\-+", "-");

        // Cắt dấu gạch nối ở đầu và cuối (tương tự Trim)
        slug = slug.Trim('-');

        return slug;
    }
}