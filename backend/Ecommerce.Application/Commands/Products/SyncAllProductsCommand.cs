using MediatR;

namespace Ecommerce.Application.Command;

public class SyncAllProductsCommand : IRequest<SyncAllProductsResponse>
{
    public string Action { get; set; } = "add"; // action "add", "update", "delete"
}

public class SyncAllProductsResponse
{
    public int TotalProducts { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount { get; set; }
    public List<int> FailedProductIds { get; set; } = new();
    public string Message { get; set; }
}






