using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using CodeFam.Notification.Constants;
using CodeFam.Notification.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CodeFam.Notification.Controllers
{
    [Route(RouteConstants.Notification.Base)]
    public class NotificationController : BaseApiController
    {
        private readonly INotificationService _service;

        public NotificationController(INotificationService service)
        {
            _service = service;
        }

        [HttpGet(RouteConstants.Notification.GetAll)]
        public async Task<IActionResult> GetNotificationList([FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            try
            {
                Guid userId = Guid.Empty;
                var result = _service.GetUserNotification(userId, pageNumber, pageSize);
                return CreateSuccessResponse(result, "Get notification list successfully");
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
                Guid userId = Guid.Empty;
                var result = _service.ReadNotification(userId, notificationId);
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
                Guid userId = Guid.Empty;
                var result = _service.ReadAllNotification(userId);
                return CreateSuccessResponse(result, "Read all notifications successfully");
            }
            catch (Exception e)
            {
                return CreateErrorResponse(e.Message, ErrorCodesConstants.InternalServerError);
            }
        }

    }
}