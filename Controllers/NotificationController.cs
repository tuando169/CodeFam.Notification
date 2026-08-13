using CodeFam.Notification.Constants;
using CodeFam.Notification.DTOs;
using CodeFam.Notification.DTOs.Notification;
using CodeFam.Notification.Services;
using Microsoft.AspNetCore.Mvc;

namespace CodeFam.Notification.Controllers;

public class NotificationController : BaseApiController
{
    private readonly INotificationService _service;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(INotificationService service, ILogger<NotificationController> logger)
    {
        _service = service;
        this._logger = logger;
    }

    [HttpGet(RouteConstants.Notification.GetAll)]
    public async Task<IActionResult> GetNotificationList([FromQuery] GetNotificationListRequestDto request)
    {
        try
        {
            var userId = Guid.Empty;
            var result = await _service.GetUserNotification(userId, request.Page, request.Limit);
            return CreateSuccessResponse(result.Items, "Get notification list successfully", result.Meta);
        }
        catch (Exception e)
        {
            return CreateErrorResponse(e.Message, ErrorCodesConstants.InternalServerError);
        }
    }

    [HttpPatch(RouteConstants.Notification.Read)]
    public async Task<IActionResult> ReadNotification([FromBody] Guid notificationId)
    {
        try
        {
            var userId = Guid.Empty;
            var result =await _service.ReadNotification(userId, notificationId);
            return CreateSuccessResponse(result, "Read notification successfully");
        }
        catch (Exception e)
        {
            return CreateErrorResponse(e.Message, ErrorCodesConstants.InternalServerError);
        }
    }

    [HttpPatch(RouteConstants.Notification.ReadAll)]
    public async Task<IActionResult> ReadAllNotification()
    {
        try
        {
            var userId = Guid.Empty;
            var result = await _service.ReadAllNotification(userId);
            return CreateSuccessResponse(result, "Read all notifications successfully");
        }
        catch (Exception e)
        {
            return CreateErrorResponse(e.Message, ErrorCodesConstants.InternalServerError);
        }
    }
}