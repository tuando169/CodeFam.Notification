using CodeFam.Notification.Constants;
using CodeFam.Notification.DTOs;
using CodeFam.Notification.DTOs.Notification;
using CodeFam.Notification.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeFam.Notification.Controllers;

[Authorize]
public class NotificationController(INotificationService service, ILogger<NotificationController> logger)
    : BaseApiController
{
    [HttpGet(RouteConstants.Notification.GetAll)]
    public async Task<IActionResult> GetNotificationList([FromQuery] GetNotificationListRequestDto request)
    {
        try
        {
            var userId = Guid.Empty;
            var result = await service.GetUserNotification(userId, request.Page, request.Limit);
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
            var result = await service.ReadNotification(userId, notificationId);
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
            var result = await service.ReadAllNotification(userId);
            return CreateSuccessResponse(result, "Read all notifications successfully");
        }
        catch (Exception e)
        {
            return CreateErrorResponse(e.Message, ErrorCodesConstants.InternalServerError);
        }
    }
}