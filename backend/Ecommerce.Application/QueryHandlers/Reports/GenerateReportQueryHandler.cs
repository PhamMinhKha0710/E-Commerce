using System.Text;
using Ecommerce.Application.Common.DTOs.Reports;
using Ecommerce.Application.Interfaces;
using Ecommerce.Application.Interfaces.Repositories;
using Ecommerce.Application.Queries.Reports;
using MediatR;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestUnit = QuestPDF.Infrastructure.Unit;

namespace Ecommerce.Application.QueryHandlers.Reports;

public class GenerateReportQueryHandler : IRequestHandler<GenerateReportQuery, ReportDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;

    public GenerateReportQueryHandler(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IUserRepository userRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
    }

    public async Task<ReportDto> Handle(GenerateReportQuery request, CancellationToken cancellationToken)
    {
        var reportData = request.ReportType.ToLower() switch
        {
            "revenue" => await GenerateRevenueReport(request.StartDate, request.EndDate, cancellationToken),
            "orders" => await GenerateOrdersReport(request.StartDate, request.EndDate, cancellationToken),
            "products" => await GenerateProductsReport(request.StartDate, request.EndDate, cancellationToken),
            "users" => await GenerateUsersReport(request.StartDate, request.EndDate, cancellationToken),
            "sales" => await GenerateSalesReport(request.StartDate, request.EndDate, cancellationToken),
            _ => throw new ArgumentException($"Loại báo cáo không hợp lệ: {request.ReportType}")
        };

        var format = request.Format.ToLower();
        byte[] fileContent;
        string fileName;
        string contentType;

        if (format == "pdf")
        {
            fileContent = GeneratePdfReport(request.ReportType, reportData, request.StartDate, request.EndDate);
            fileName = $"{request.ReportType}_{request.StartDate:yyyyMMdd}_{request.EndDate:yyyyMMdd}.pdf";
            contentType = "application/pdf";
        }
        else
        {
            // Default to CSV
            fileContent = GenerateCsvReport(request.ReportType, reportData);
            fileName = $"{request.ReportType}_{request.StartDate:yyyyMMdd}_{request.EndDate:yyyyMMdd}.csv";
            contentType = "text/csv; charset=utf-8";
        }

        return new ReportDto
        {
            ReportId = DateTime.UtcNow.Ticks.GetHashCode(),
            ReportType = request.ReportType,
            ReportName = GetReportName(request.ReportType),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            GeneratedAt = DateTime.UtcNow,
            Format = request.Format,
            FileContent = fileContent,
            ContentType = contentType,
            FileName = fileName
        };
    }

    private async Task<object> GenerateRevenueReport(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
    {
        var ordersQuery = _orderRepository.GetOrdersQueryable()
            .Include(o => o.Payments)
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate);

        var paidOrders = await ordersQuery
            .Where(o => o.Payments.Any(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "COD"))
            .ToListAsync(cancellationToken);

        var totalRevenue = paidOrders.Sum(o => o.OrderTotal);
        var totalOrders = paidOrders.Count;
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Daily revenue
        var dailyRevenue = paidOrders
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new RevenueReportItem
            {
                Period = g.Key.ToString("dd/MM/yyyy"),
                Revenue = g.Sum(o => o.OrderTotal),
                OrderCount = g.Count()
            })
            .OrderBy(x => x.Period)
            .ToList();

        // Monthly revenue
        var monthlyRevenue = paidOrders
            .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
            .Select(g => new RevenueReportItem
            {
                Period = $"{g.Key.Month}/{g.Key.Year}",
                Revenue = g.Sum(o => o.OrderTotal),
                OrderCount = g.Count()
            })
            .OrderBy(x => x.Period)
            .ToList();

        return new RevenueReportData
        {
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders,
            AverageOrderValue = averageOrderValue,
            DailyRevenue = dailyRevenue,
            MonthlyRevenue = monthlyRevenue
        };
    }

    private async Task<object> GenerateOrdersReport(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
    {
        var ordersQuery = _orderRepository.GetOrdersQueryable()
            .Include(o => o.User)
            .Include(o => o.Payments)
                .ThenInclude(p => p.PaymentMethod)
            .Include(o => o.OrderStatusHistories)
                .ThenInclude(h => h.OrderStatus)
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate);

        var orders = await ordersQuery.ToListAsync(cancellationToken);

        var completedOrders = orders.Count(o => 
            o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
            o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).First().OrderStatus.Status.ToLower().Contains("complete"));
        
        var pendingOrders = orders.Count(o => 
            o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
            o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).First().OrderStatus.Status.ToLower().Contains("pending"));
        
        var cancelledOrders = orders.Count(o => 
            o.OrderStatusHistories != null && o.OrderStatusHistories.Any() &&
            o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).First().OrderStatus.Status.ToLower().Contains("cancel"));

        var paidOrders = orders.Where(o => o.Payments.Any(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "COD"));
        var totalRevenue = paidOrders.Sum(o => o.OrderTotal);

        var orderItems = orders.Select(o =>
        {
            var latestStatus = o.OrderStatusHistories != null && o.OrderStatusHistories.Any()
                ? o.OrderStatusHistories.OrderByDescending(h => h.CreateAt).First().OrderStatus.Status
                : "Pending";
            
            var latestPayment = o.Payments?.OrderByDescending(p => p.CreatedAt).FirstOrDefault();

            return new OrderReportItem
            {
                OrderNumber = o.OrderNumber,
                CustomerName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}".Trim() : "Khách hàng",
                OrderDate = o.OrderDate,
                OrderTotal = o.OrderTotal,
                Status = latestStatus,
                PaymentStatus = latestPayment?.PaymentStatus ?? "Pending",
                PaymentMethod = latestPayment?.PaymentMethod?.Name ?? latestPayment?.PaymentStatus ?? "N/A"
            };
        }).ToList();

        return new OrdersReportData
        {
            TotalOrders = orders.Count,
            CompletedOrders = completedOrders,
            PendingOrders = pendingOrders,
            CancelledOrders = cancelledOrders,
            TotalRevenue = totalRevenue,
            Orders = orderItems
        };
    }

    private async Task<object> GenerateProductsReport(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
    {
        var ordersQuery = _orderRepository.GetOrdersQueryable()
            .Include(o => o.OrderLines)
                .ThenInclude(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product)
                        .ThenInclude(p => p.ProductCategory)
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate);

        var orders = await ordersQuery.ToListAsync(cancellationToken);
        var orderLines = orders.SelectMany(o => o.OrderLines).ToList();

        var topSelling = orderLines
            .GroupBy(ol => new { 
                ProductId = ol.ProductItem.ProductId, 
                ProductName = ol.ProductItem.Product.Name,
                CategoryName = ol.ProductItem.Product.ProductCategory != null ? ol.ProductItem.Product.ProductCategory.Name : "Không có",
                Price = ol.ProductItem.Price,
                QtyInStock = ol.ProductItem.QtyInStock
            })
            .Select(g => new ProductReportItem
            {
                ProductName = g.Key.ProductName,
                Category = g.Key.CategoryName,
                SalesCount = g.Sum(ol => ol.Qty),
                Revenue = g.Sum(ol => ol.Price * ol.Qty),
                StockQuantity = g.Key.QtyInStock,
                Price = g.Key.Price
            })
            .OrderByDescending(p => p.SalesCount)
            .Take(20)
            .ToList();

        var allProducts = await _productRepository.Query()
            .Include(p => p.ProductCategory)
            .Include(p => p.ProductItems)
            .ToListAsync(cancellationToken);

        var lowStockProducts = allProducts
            .SelectMany(p => p.ProductItems.Select(pi => new { Product = p, ProductItem = pi }))
            .Where(x => x.ProductItem.QtyInStock < 10 && x.ProductItem.QtyInStock > 0)
            .Select(x => new ProductReportItem
            {
                ProductName = x.Product.Name,
                Category = x.Product.ProductCategory?.Name ?? "Không có",
                SalesCount = 0,
                Revenue = 0,
                StockQuantity = x.ProductItem.QtyInStock,
                Price = x.ProductItem.Price
            })
            .ToList();

        var outOfStockCount = allProducts
            .SelectMany(p => p.ProductItems)
            .Count(pi => pi.QtyInStock <= 0);

        return new ProductsReportData
        {
            TotalProducts = allProducts.Count,
            LowStockProducts = lowStockProducts.Count,
            OutOfStockProducts = outOfStockCount,
            TopSellingProducts = topSelling,
            LowStockProductsList = lowStockProducts
        };
    }

    private async Task<object> GenerateUsersReport(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllQueryable()
            .Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate)
            .ToListAsync(cancellationToken);

        var ordersQuery = _orderRepository.GetOrdersQueryable()
            .Include(o => o.Payments)
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate);

        var orders = await ordersQuery.ToListAsync(cancellationToken);

        var userStats = users.Select(u =>
        {
            var userOrders = orders.Where(o => o.UserId == u.Id).ToList();
            var paidOrders = userOrders.Where(o => o.Payments.Any(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "COD"));
            
            return new UserReportItem
            {
                Name = $"{u.FirstName} {u.LastName}".Trim(),
                Email = u.Email,
                Phone = u.PhoneNumber ?? "",
                CreatedAt = u.CreatedAt,
                TotalOrders = userOrders.Count,
                TotalSpent = paidOrders.Sum(o => o.OrderTotal)
            };
        }).ToList();

        var activeUsers = userStats.Count(u => u.TotalOrders > 0);

        return new UsersReportData
        {
            TotalUsers = users.Count,
            NewUsers = users.Count,
            ActiveUsers = activeUsers,
            Users = userStats
        };
    }

    private async Task<object> GenerateSalesReport(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
    {
        var ordersQuery = _orderRepository.GetOrdersQueryable()
            .Include(o => o.OrderLines)
                .ThenInclude(ol => ol.ProductItem)
                    .ThenInclude(pi => pi.Product)
                        .ThenInclude(p => p.ProductCategory)
            .Include(o => o.Payments)
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate);

        var paidOrders = await ordersQuery
            .Where(o => o.Payments.Any(p => p.PaymentStatus == "Completed" || p.PaymentStatus == "COD"))
            .ToListAsync(cancellationToken);

        var totalSales = paidOrders.Sum(o => o.OrderTotal);
        var totalOrders = paidOrders.Count;
        var averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        var orderLines = paidOrders.SelectMany(o => o.OrderLines).ToList();

        // Sales by category
        var salesByCategory = orderLines
            .GroupBy(ol => ol.ProductItem.Product.ProductCategory != null ? ol.ProductItem.Product.ProductCategory.Name : "Không có danh mục")
            .Select(g => new
            {
                Category = g.Key,
                Quantity = g.Sum(ol => ol.Qty),
                Revenue = g.Sum(ol => ol.Price * ol.Qty)
            })
            .OrderByDescending(x => x.Revenue)
            .ToList();

        var totalRevenue = salesByCategory.Sum(x => x.Revenue);
        var salesByCategoryList = salesByCategory.Select(x => new SalesReportItem
        {
            Name = x.Category,
            Quantity = x.Quantity,
            Revenue = x.Revenue,
            Percentage = totalRevenue > 0 ? (x.Revenue / totalRevenue) * 100 : 0
        }).ToList();

        // Sales by product
        var salesByProduct = orderLines
            .GroupBy(ol => ol.ProductItem.Product.Name)
            .Select(g => new
            {
                Product = g.Key,
                Quantity = g.Sum(ol => ol.Qty),
                Revenue = g.Sum(ol => ol.Price * ol.Qty)
            })
            .OrderByDescending(x => x.Revenue)
            .Take(20)
            .ToList();

        var salesByProductList = salesByProduct.Select(x => new SalesReportItem
        {
            Name = x.Product,
            Quantity = x.Quantity,
            Revenue = x.Revenue,
            Percentage = totalRevenue > 0 ? (x.Revenue / totalRevenue) * 100 : 0
        }).ToList();

        return new SalesReportData
        {
            TotalSales = totalSales,
            TotalOrders = totalOrders,
            AverageOrderValue = averageOrderValue,
            SalesByCategory = salesByCategoryList,
            SalesByProduct = salesByProductList
        };
    }

    private byte[] GenerateCsvReport(string reportType, object reportData)
    {
        var csv = new StringBuilder();
        
        switch (reportType.ToLower())
        {
            case "revenue":
                var revenueData = (RevenueReportData)reportData;
                csv.AppendLine("BÁO CÁO DOANH THU");
                csv.AppendLine($"Tổng doanh thu,{revenueData.TotalRevenue:N0}");
                csv.AppendLine($"Tổng đơn hàng,{revenueData.TotalOrders}");
                csv.AppendLine($"Giá trị đơn hàng trung bình,{revenueData.AverageOrderValue:N0}");
                csv.AppendLine();
                csv.AppendLine("Doanh thu theo ngày");
                csv.AppendLine("Ngày,Doanh thu,Số đơn hàng");
                foreach (var item in revenueData.DailyRevenue)
                {
                    csv.AppendLine($"{item.Period},{item.Revenue:N0},{item.OrderCount}");
                }
                break;

            case "orders":
                var ordersData = (OrdersReportData)reportData;
                csv.AppendLine("BÁO CÁO ĐƠN HÀNG");
                csv.AppendLine($"Tổng đơn hàng,{ordersData.TotalOrders}");
                csv.AppendLine($"Đơn hàng hoàn thành,{ordersData.CompletedOrders}");
                csv.AppendLine($"Đơn hàng chờ xử lý,{ordersData.PendingOrders}");
                csv.AppendLine($"Đơn hàng đã hủy,{ordersData.CancelledOrders}");
                csv.AppendLine($"Tổng doanh thu,{ordersData.TotalRevenue:N0}");
                csv.AppendLine();
                csv.AppendLine("Chi tiết đơn hàng");
                csv.AppendLine("Mã đơn hàng,Khách hàng,Ngày đặt,Tổng tiền,Trạng thái,Trạng thái thanh toán,Phương thức thanh toán");
                foreach (var order in ordersData.Orders)
                {
                    csv.AppendLine($"{order.OrderNumber},{order.CustomerName},{order.OrderDate:dd/MM/yyyy},{order.OrderTotal:N0},{order.Status},{order.PaymentStatus},{order.PaymentMethod}");
                }
                break;

            case "products":
                var productsData = (ProductsReportData)reportData;
                csv.AppendLine("BÁO CÁO SẢN PHẨM");
                csv.AppendLine($"Tổng sản phẩm,{productsData.TotalProducts}");
                csv.AppendLine($"Sản phẩm sắp hết hàng,{productsData.LowStockProducts}");
                csv.AppendLine($"Sản phẩm hết hàng,{productsData.OutOfStockProducts}");
                csv.AppendLine();
                csv.AppendLine("Sản phẩm bán chạy");
                csv.AppendLine("Tên sản phẩm,Danh mục,Số lượng bán,Doanh thu,Tồn kho,Giá");
                foreach (var product in productsData.TopSellingProducts)
                {
                    csv.AppendLine($"{product.ProductName},{product.Category},{product.SalesCount},{product.Revenue:N0},{product.StockQuantity},{product.Price:N0}");
                }
                break;

            case "users":
                var usersData = (UsersReportData)reportData;
                csv.AppendLine("BÁO CÁO NGƯỜI DÙNG");
                csv.AppendLine($"Tổng người dùng,{usersData.TotalUsers}");
                csv.AppendLine($"Người dùng mới,{usersData.NewUsers}");
                csv.AppendLine($"Người dùng hoạt động,{usersData.ActiveUsers}");
                csv.AppendLine();
                csv.AppendLine("Chi tiết người dùng");
                csv.AppendLine("Tên,Email,Số điện thoại,Ngày đăng ký,Tổng đơn hàng,Tổng chi tiêu");
                foreach (var user in usersData.Users)
                {
                    csv.AppendLine($"{user.Name},{user.Email},{user.Phone},{user.CreatedAt:dd/MM/yyyy},{user.TotalOrders},{user.TotalSpent:N0}");
                }
                break;

            case "sales":
                var salesData = (SalesReportData)reportData;
                csv.AppendLine("BÁO CÁO BÁN HÀNG");
                csv.AppendLine($"Tổng doanh số,{salesData.TotalSales:N0}");
                csv.AppendLine($"Tổng đơn hàng,{salesData.TotalOrders}");
                csv.AppendLine($"Giá trị đơn hàng trung bình,{salesData.AverageOrderValue:N0}");
                csv.AppendLine();
                csv.AppendLine("Doanh số theo danh mục");
                csv.AppendLine("Danh mục,Số lượng,Doanh thu,Tỷ lệ %");
                foreach (var item in salesData.SalesByCategory)
                {
                    csv.AppendLine($"{item.Name},{item.Quantity},{item.Revenue:N0},{item.Percentage:F2}%");
                }
                csv.AppendLine();
                csv.AppendLine("Doanh số theo sản phẩm");
                csv.AppendLine("Sản phẩm,Số lượng,Doanh thu,Tỷ lệ %");
                foreach (var item in salesData.SalesByProduct)
                {
                    csv.AppendLine($"{item.Name},{item.Quantity},{item.Revenue:N0},{item.Percentage:F2}%");
                }
                break;
        }

        return Encoding.UTF8.GetBytes(csv.ToString());
    }

    private byte[] GeneratePdfReport(string reportType, object reportData, DateTime startDate, DateTime endDate)
    {
        QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
        
        var document = reportType.ToLower() switch
        {
            "revenue" => GenerateRevenuePdf((RevenueReportData)reportData, startDate, endDate),
            "orders" => GenerateOrdersPdf((OrdersReportData)reportData, startDate, endDate),
            "products" => GenerateProductsPdf((ProductsReportData)reportData, startDate, endDate),
            "users" => GenerateUsersPdf((UsersReportData)reportData, startDate, endDate),
            "sales" => GenerateSalesPdf((SalesReportData)reportData, startDate, endDate),
            _ => throw new ArgumentException($"Loại báo cáo không hợp lệ: {reportType}")
        };

        return document.GeneratePdf();
    }

    private QuestPDF.Fluent.Document GenerateRevenuePdf(RevenueReportData data, DateTime startDate, DateTime endDate)
    {
        return QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, QuestUnit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header()
                    .Text("BÁO CÁO DOANH THU")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, QuestUnit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        // Thông tin chung
                        column.Item().Text($"Khoảng thời gian: {startDate:dd/MM/yyyy} - {endDate:dd/MM/yyyy}").FontSize(12);
                        column.Item().Text($"Ngày tạo: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(10).FontColor(Colors.Grey.Medium);

                        column.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Cell().Element(CellStyle).Text("Tổng doanh thu").FontSize(12);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalRevenue:N0} ₫").SemiBold().FontSize(12);

                            table.Cell().Element(CellStyle).Text("Tổng đơn hàng");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalOrders:N0}");

                            table.Cell().Element(CellStyle).Text("Giá trị đơn hàng trung bình");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.AverageOrderValue:N0} ₫");
                        });

                        // Doanh thu theo ngày
                        if (data.DailyRevenue.Any())
                        {
                            column.Item().PaddingTop(20).Text("Doanh thu theo ngày").FontSize(14).SemiBold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(1);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Ngày").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Doanh thu").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Số đơn").SemiBold();
                                });

                                foreach (var item in data.DailyRevenue)
                                {
                                    table.Cell().Element(CellStyle).Text(item.Period);
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Revenue:N0} ₫");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.OrderCount}");
                                }
                            });
                        }
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Trang ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.CurrentPageNumber().FontSize(9).FontColor(Colors.Grey.Medium);
                        x.Span(" / ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.TotalPages().FontSize(9).FontColor(Colors.Grey.Medium);
                    });
            });
        });
    }

    private QuestPDF.Fluent.Document GenerateOrdersPdf(OrdersReportData data, DateTime startDate, DateTime endDate)
    {
        return QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, QuestUnit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(9));

                page.Header()
                    .Text("BÁO CÁO ĐƠN HÀNG")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, QuestUnit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        column.Item().Text($"Khoảng thời gian: {startDate:dd/MM/yyyy} - {endDate:dd/MM/yyyy}").FontSize(12);
                        column.Item().Text($"Ngày tạo: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(10).FontColor(Colors.Grey.Medium);

                        column.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Cell().Element(CellStyle).Text("Tổng đơn hàng").FontSize(12);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalOrders:N0}").SemiBold().FontSize(12);

                            table.Cell().Element(CellStyle).Text("Đơn hàng hoàn thành");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.CompletedOrders:N0}");

                            table.Cell().Element(CellStyle).Text("Đơn hàng chờ xử lý");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.PendingOrders:N0}");

                            table.Cell().Element(CellStyle).Text("Đơn hàng đã hủy");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.CancelledOrders:N0}");

                            table.Cell().Element(CellStyle).Text("Tổng doanh thu").FontSize(12);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalRevenue:N0} ₫").SemiBold().FontSize(12);
                        });

                        if (data.Orders.Any())
                        {
                            column.Item().PaddingTop(20).Text("Chi tiết đơn hàng").FontSize(14).SemiBold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(1.5f);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1.2f);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Mã đơn").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).Text("Khách hàng").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).AlignRight().Text("Ngày").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).AlignRight().Text("Tổng tiền").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).Text("Trạng thái").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).Text("Thanh toán").SemiBold().FontSize(8);
                                });

                                foreach (var order in data.Orders)
                                {
                                    table.Cell().Element(CellStyle).Text(order.OrderNumber).FontSize(8);
                                    table.Cell().Element(CellStyle).Text(order.CustomerName).FontSize(8);
                                    table.Cell().Element(CellStyle).AlignRight().Text(order.OrderDate.ToString("dd/MM/yyyy")).FontSize(8);
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{order.OrderTotal:N0} ₫").FontSize(8);
                                    table.Cell().Element(CellStyle).Text(order.Status).FontSize(8);
                                    table.Cell().Element(CellStyle).Text(order.PaymentStatus).FontSize(8);
                                }
                            });
                        }
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Trang ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.CurrentPageNumber().FontSize(9).FontColor(Colors.Grey.Medium);
                        x.Span(" / ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.TotalPages().FontSize(9).FontColor(Colors.Grey.Medium);
                    });
            });
        });
    }

    private QuestPDF.Fluent.Document GenerateProductsPdf(ProductsReportData data, DateTime startDate, DateTime endDate)
    {
        return QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, QuestUnit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header()
                    .Text("BÁO CÁO SẢN PHẨM")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, QuestUnit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        column.Item().Text($"Khoảng thời gian: {startDate:dd/MM/yyyy} - {endDate:dd/MM/yyyy}").FontSize(12);
                        column.Item().Text($"Ngày tạo: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(10).FontColor(Colors.Grey.Medium);

                        column.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Cell().Element(CellStyle).Text("Tổng sản phẩm").FontSize(12);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalProducts:N0}").SemiBold().FontSize(12);

                            table.Cell().Element(CellStyle).Text("Sản phẩm sắp hết hàng");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.LowStockProducts:N0}");

                            table.Cell().Element(CellStyle).Text("Sản phẩm hết hàng");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.OutOfStockProducts:N0}");
                        });

                        if (data.TopSellingProducts.Any())
                        {
                            column.Item().PaddingTop(20).Text("Sản phẩm bán chạy").FontSize(14).SemiBold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1.5f);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1.5f);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Tên sản phẩm").SemiBold();
                                    header.Cell().Element(CellStyle).Text("Danh mục").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Số lượng").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Doanh thu").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Tồn kho").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Giá").SemiBold();
                                });

                                foreach (var product in data.TopSellingProducts)
                                {
                                    table.Cell().Element(CellStyle).Text(product.ProductName);
                                    table.Cell().Element(CellStyle).Text(product.Category);
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{product.SalesCount:N0}");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{product.Revenue:N0} ₫");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{product.StockQuantity:N0}");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{product.Price:N0} ₫");
                                }
                            });
                        }
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Trang ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.CurrentPageNumber().FontSize(9).FontColor(Colors.Grey.Medium);
                        x.Span(" / ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.TotalPages().FontSize(9).FontColor(Colors.Grey.Medium);
                    });
            });
        });
    }

    private QuestPDF.Fluent.Document GenerateUsersPdf(UsersReportData data, DateTime startDate, DateTime endDate)
    {
        return QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, QuestUnit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(9));

                page.Header()
                    .Text("BÁO CÁO NGƯỜI DÙNG")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, QuestUnit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        column.Item().Text($"Khoảng thời gian: {startDate:dd/MM/yyyy} - {endDate:dd/MM/yyyy}").FontSize(12);
                        column.Item().Text($"Ngày tạo: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(10).FontColor(Colors.Grey.Medium);

                        column.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Cell().Element(CellStyle).Text("Tổng người dùng").FontSize(12);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalUsers:N0}").SemiBold().FontSize(12);

                            table.Cell().Element(CellStyle).Text("Người dùng mới");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.NewUsers:N0}");

                            table.Cell().Element(CellStyle).Text("Người dùng hoạt động");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.ActiveUsers:N0}");
                        });

                        if (data.Users.Any())
                        {
                            column.Item().PaddingTop(20).Text("Chi tiết người dùng").FontSize(14).SemiBold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(2);
                                    columns.RelativeColumn(2.5f);
                                    columns.RelativeColumn(1.5f);
                                    columns.RelativeColumn(1.2f);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1.5f);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Tên").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).Text("Email").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).Text("Số điện thoại").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).AlignRight().Text("Ngày đăng ký").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).AlignRight().Text("Tổng đơn").SemiBold().FontSize(8);
                                    header.Cell().Element(CellStyle).AlignRight().Text("Tổng chi tiêu").SemiBold().FontSize(8);
                                });

                                foreach (var user in data.Users)
                                {
                                    table.Cell().Element(CellStyle).Text(user.Name).FontSize(8);
                                    table.Cell().Element(CellStyle).Text(user.Email).FontSize(8);
                                    table.Cell().Element(CellStyle).Text(user.Phone).FontSize(8);
                                    table.Cell().Element(CellStyle).AlignRight().Text(user.CreatedAt.ToString("dd/MM/yyyy")).FontSize(8);
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{user.TotalOrders:N0}").FontSize(8);
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{user.TotalSpent:N0} ₫").FontSize(8);
                                }
                            });
                        }
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Trang ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.CurrentPageNumber().FontSize(9).FontColor(Colors.Grey.Medium);
                        x.Span(" / ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.TotalPages().FontSize(9).FontColor(Colors.Grey.Medium);
                    });
            });
        });
    }

    private QuestPDF.Fluent.Document GenerateSalesPdf(SalesReportData data, DateTime startDate, DateTime endDate)
    {
        return QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, QuestUnit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header()
                    .Text("BÁO CÁO BÁN HÀNG")
                    .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, QuestUnit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        column.Item().Text($"Khoảng thời gian: {startDate:dd/MM/yyyy} - {endDate:dd/MM/yyyy}").FontSize(12);
                        column.Item().Text($"Ngày tạo: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(10).FontColor(Colors.Grey.Medium);

                        column.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Cell().Element(CellStyle).Text("Tổng doanh số").FontSize(12);
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalSales:N0} ₫").SemiBold().FontSize(12);

                            table.Cell().Element(CellStyle).Text("Tổng đơn hàng");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.TotalOrders:N0}");

                            table.Cell().Element(CellStyle).Text("Giá trị đơn hàng trung bình");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{data.AverageOrderValue:N0} ₫");
                        });

                        if (data.SalesByCategory.Any())
                        {
                            column.Item().PaddingTop(20).Text("Doanh số theo danh mục").FontSize(14).SemiBold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1.5f);
                                    columns.RelativeColumn(1);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Danh mục").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Số lượng").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Doanh thu").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Tỷ lệ %").SemiBold();
                                });

                                foreach (var item in data.SalesByCategory)
                                {
                                    table.Cell().Element(CellStyle).Text(item.Name);
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Quantity:N0}");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Revenue:N0} ₫");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Percentage:F2}%");
                                }
                            });
                        }

                        if (data.SalesByProduct.Any())
                        {
                            column.Item().PaddingTop(20).Text("Doanh số theo sản phẩm").FontSize(14).SemiBold();
                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1.5f);
                                    columns.RelativeColumn(1);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Sản phẩm").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Số lượng").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Doanh thu").SemiBold();
                                    header.Cell().Element(CellStyle).AlignRight().Text("Tỷ lệ %").SemiBold();
                                });

                                foreach (var item in data.SalesByProduct)
                                {
                                    table.Cell().Element(CellStyle).Text(item.Name);
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Quantity:N0}");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Revenue:N0} ₫");
                                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Percentage:F2}%");
                                }
                            });
                        }
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Trang ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.CurrentPageNumber().FontSize(9).FontColor(Colors.Grey.Medium);
                        x.Span(" / ").FontSize(9).FontColor(Colors.Grey.Medium);
                        x.TotalPages().FontSize(9).FontColor(Colors.Grey.Medium);
                    });
            });
        });
    }

    private static IContainer CellStyle(IContainer container)
    {
        return container
            .BorderBottom(1)
            .BorderColor(Colors.Grey.Lighten2)
            .PaddingVertical(5)
            .PaddingHorizontal(5);
    }

    private string GetReportName(string reportType)
    {
        return reportType.ToLower() switch
        {
            "revenue" => "Báo cáo doanh thu",
            "orders" => "Báo cáo đơn hàng",
            "products" => "Báo cáo sản phẩm",
            "users" => "Báo cáo người dùng",
            "sales" => "Báo cáo bán hàng",
            _ => "Báo cáo"
        };
    }
}

