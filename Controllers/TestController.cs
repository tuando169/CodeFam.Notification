using CodeFam.Notification.Constants;
using CodeFam.Notification.DTOs;
using CodeFam.Notification.Services;
using Microsoft.AspNetCore.Mvc;

namespace CodeFam.Notification.Controllers;

[Route("test")]
public class TestController : BaseApiController
{
    private readonly INotificationService _service;

    public TestController(INotificationService service)
    {
        _service = service;
    }

    [HttpPost("create-notification")]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto request)
    {
        try
        {
            var userId = Guid.Empty;
            var notification = await _service.CreateNotification(userId, request.Channel, request.Type, request.Title,
                request.Content);
            return CreateSuccessResponse(notification, "Create notification successfully");
        }
        catch (Exception ex)
        {
            return CreateErrorResponse(ex.Message, ErrorCodesConstants.InternalServerError);
        }
    }
}