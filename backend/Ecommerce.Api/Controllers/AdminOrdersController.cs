using Ecommerce.Application.Commands.Orders;
using Ecommerce.Application.Common.DTOs.Order.Admin;
using Ecommerce.Application.Queries.AdminOrders;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Policy = "AdminOnly")]
public class AdminOrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminOrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<AdminOrderListResponseDto>> GetOrders([FromQuery] GetAdminOrdersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{orderId:int}")]
    public async Task<ActionResult<AdminOrderDetailDto>> GetOrderDetail(int orderId)
    {
        var detail = await _mediator.Send(new GetAdminOrderDetailQuery { OrderId = orderId });
        if (detail == null)
        {
            return NotFound();
        }

        return Ok(detail);
    }

    [HttpPut("{orderId:int}/status")]
    public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] AdminUpdateOrderStatusDto request)
    {
        await _mediator.Send(new UpdateAdminOrderStatusCommand
        {
            OrderId = orderId,
            Status = request.Status,
            AdminNote = request.AdminNote,
            NotifyCustomer = request.NotifyCustomer
        });

        return NoContent();
    }

    [HttpPut("{orderId:int}/note")]
    public async Task<IActionResult> UpdateNote(int orderId, [FromBody] AdminUpdateOrderNoteDto request)
    {
        await _mediator.Send(new UpdateAdminOrderNoteCommand
        {
            OrderId = orderId,
            Note = request.Note
        });

        return NoContent();
    }

    [HttpDelete("{orderId:int}")]
    public async Task<IActionResult> DeleteOrder(int orderId)
    {
        await _mediator.Send(new DeleteAdminOrderCommand { OrderId = orderId });
        return NoContent();
    }
}

