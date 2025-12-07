using Ecommerce.Application.Common.DTOs.Reports;
using MediatR;

namespace Ecommerce.Application.Queries.Reports;

public class GenerateReportQuery : IRequest<ReportDto>
{
    public string ReportType { get; set; } = string.Empty; // revenue, orders, products, users, sales
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Format { get; set; } = "csv"; // csv, excel, pdf
}
















