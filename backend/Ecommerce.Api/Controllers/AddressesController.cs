using MediatR;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Application.Queries;
using Ecommerce.Application.Commands;
using Ecommerce.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Ecommerce.Application.Common.DTOs;

namespace Ecommerce.API.Controllers
{
    [Route("api/addresses")]
    [ApiController]
    public class AddressesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUserService;
        
        public AddressesController(IMediator mediator, ICurrentUserService currentUserService)
        {
            _mediator = mediator;
            _currentUserService = currentUserService;
        }

        
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<AddressDto>>> GetAddresses()
        {
            try
            {
                int? userId = _currentUserService.GetUserId();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }
                var query = new GetAddressesQuery { UserId = userId.Value };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An unexpected error occurred: {ex.Message}" });
            }
        }

        
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddressDto>> CreateAddress([FromBody] CreateAddressCommand command)
        {
            try
            {
                int? userId = _currentUserService.GetUserId();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }
                command.UserId = userId.Value;
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetAddresses), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An unexpected error occurred: {ex.Message}" });
            }
        }

        // PUT: api/addresses/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<AddressDto>> UpdateAddress(string id, [FromBody] UpdateAddressCommand command)
        {
            try
            {
                if (!int.TryParse(id, out int addressId))
                {
                    return BadRequest(new { error = "Invalid address ID" });
                }

                int? userId = _currentUserService.GetUserId();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                command.AddressId = addressId;
                command.UserId = userId.Value;
                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An unexpected error occurred: {ex.Message}" });
            }
        }

        // DELETE: api/addresses/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAddress(string id)
        {
            try
            {
                if (!int.TryParse(id, out int addressId))
                {
                    return BadRequest(new { error = "Invalid address ID" });
                }

                int? userId = _currentUserService.GetUserId();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }

                var command = new DeleteAddressCommand
                {
                    AddressId = addressId,
                    UserId = userId.Value
                };
                await _mediator.Send(command);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An unexpected error occurred: {ex.Message}" });
            }
        }
        
        [HttpGet("default")]
        [Authorize]
        public async Task<IActionResult> GetDefaultAddress()
        {
            try
            {
                int? userId = _currentUserService.GetUserId();
                if (!userId.HasValue)
                {
                    return Unauthorized(new { error = "User not authenticated" });
                }
                var query = new GetDefaultAddressQuery { UserId = userId.Value };
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An unexpected error occurred: {ex.Message}" });
            }
        }
    }
}