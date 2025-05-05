using System.Text;
using Ecommerce.API.Filters;
using Ecommerce.Application.CommandHandler;
using Ecommerce.Application.Common.DTOs;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Interfaces.Services;
using Ecommerce.Application.Queries.Categories;
using Ecommerce.Application.QueryHandlers;
using Ecommerce.Infrastructure.Elasticsearch;
using Ecommerce.Infrastructure.Messaging;
using Ecommerce.Infrastructure.Persistence;
using Ecommerce.Infrastructure.Persistence.Repositories;
using Ecommerce.Infrastructure.Repositories;
using Ecommerce.Infrastructure.Services;
using Ecommere.Application.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nest;
using Slugify;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Kết nối tới cơ sở dữ liệu SQL Server bằng chuỗi kết nối có tên "DefaultConnection"
    // Chuỗi kết nối này được lấy từ file appsettings.json
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), 
        sqlOptions => 
        {
            // Đặt thời gian chờ tối đa là 30 giây cho các lệnh SQL
            // Để tránh trường hợp truy vấn chạy quá lâu gây chậm ứng dụng
            sqlOptions.CommandTimeout(30);

            // Bật tính năng thử lại tối đa 3 lần nếu gặp lỗi tạm thời
            // Ví dụ: mất kết nối mạng hoặc cơ sở dữ liệu tạm thời không phản hồi
            sqlOptions.EnableRetryOnFailure(3);
        });

    // Tắt tính năng theo dõi thay đổi khi chỉ cần đọc dữ liệu (không sửa/xóa)
    // Điều này rất quan trọng để tăng tốc độ khi đọc dữ liệu trong môi trường Production
    if (!builder.Environment.IsDevelopment())
    {
        options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
    }
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin() 
               .AllowAnyMethod() 
               .AllowAnyHeader(); 
    });
});

/// ************** ------------------------------ Scope dependency-----------------------------------///*********************
//  ************** _______________________________________________________________________________///*********************
// register
builder.Services.AddScoped<RegisterCommandHandler>();
builder.Services.AddScoped<LoginCommandHandler>();
builder.Services.AddScoped<VerifyOtpCommandHandler>();
builder.Services.AddScoped<LogoutCommandHandler>();
builder.Services.AddScoped<SendOtpCommandHandler>();
builder.Services.AddScoped<GetUserInfoQueryHandler>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
// builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddScoped<IRedisService, RedisService>();

// Register additional repositories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddTransient<ICustomSlugHelper, SlugCustomHelper>();

//Register Address
builder.Services.AddScoped<IAddressRepository, AddressRepository>();

// Register Khởi tạo admin
builder.Services.AddScoped<AdminInitializer>();


// Register cart
builder.Services.AddScoped<ICartRepository, CartRepository>();

// Add the ICurrentUserService registration
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// Register Payment
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, VnPayService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Register rabitmq
builder.Services.AddScoped<IRabbitMQService,  RabbitMQService>();
builder.Services.AddHostedService<EmailConsumerWorker>();

// đăng ký Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(builder.Configuration["Redis:Connection"]));
builder.Services.AddLogging(logging => logging.AddConsole());

// đăng ký đồng bộ elashtic search
builder.Services.AddScoped<IProductItemRepository, ProductItemRepository>();

// Register MediatR 
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(GetAllCategoriesQuery).Assembly);
});

// Register Elastichsearch
builder.Services.AddScoped<IElasticsearchService, ElasticsearchService>();
var elasticUri = builder.Configuration["Elasticsearch:Uri"];
var settings = new ConnectionSettings(new Uri(elasticUri))
    .DefaultIndex("ecommerce_product_item")
    .DefaultMappingFor<ProductItemDto>(m => m
        .PropertyName(p => p.Name, "name")
        .PropertyName(p => p.ProductId, "product_id")
        .PropertyName(p => p.ItemId, "item_id")
        .PropertyName(p => p.Description, "description")
        .PropertyName(p => p.Category, "category")
        .PropertyName(p => p.SubCategory, "sub_category")
        .PropertyName(p => p.Brand, "brand")
        .PropertyName(p => p.Price, "price")
        .PropertyName(p => p.OldPrice, "old_price")
        .PropertyName(p => p.Stock, "stock")
        .PropertyName(p => p.Sku, "sku")
        .PropertyName(p => p.ImageUrl, "image_url")
        .PropertyName(p => p.PopularityScore, "popularity_score")
        .PropertyName(p => p.HasVariation, "has_variation")
        .PropertyName(p => p.CreatedAt, "created_at")
        .PropertyName(p => p.UpdatedAt, "updated_at")
        .PropertyName(p => p.Tags, "tags")
        .PropertyName(p => p.Rating, "rating")
        .PropertyName(p => p.TotalRatingCount, "total_rating_count")
        .PropertyName(p => p.Status, "status")
    );
builder.Services.AddSingleton<IElasticClient>(new ElasticClient(settings));
builder.Services.AddHttpClient();
//+++++++++++++++++++++++++++++++++++++++++++ Dependency injection-end ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++





/// ************** ------------------------------ Swagger-Start-----------------------------------///*********************
//  ************** _______________________________________________________________________________///*********************
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Ecommerce API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field (e.g., 'Bearer {token}')",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] 
                                ?? throw new InvalidOperationException("JWT Key không được cấu hình!")))
        }; 
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("VerifiedUser", policy => policy.RequireClaim("IsVerified", "true"));
});
//+++++++++++++++++++++++++++++++++++++++++++ swagger-end ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++








/// ************** ------------------------------ Buider.Build-----------------------------------///*********************
var app = builder.Build();

// Gọi AdminInitializer khi ứng dụng khởi động
using (var scope = app.Services.CreateScope())
{
    var adminInitializer = scope.ServiceProvider.GetRequiredService<AdminInitializer>();
    await adminInitializer.InitializeAsync();
}


app.UseCors("AllowAll");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();