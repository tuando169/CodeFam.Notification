using CodeFam.Notification.Constants;
using CodeFam.Notification.DTOs;
using CodeFam.Notification.DTOs.Notification;
using CodeFam.Notification.Services;
using CodeFam.Notification.Services.Email;
using Microsoft.AspNetCore.Mvc;

namespace CodeFam.Notification.Controllers;

[Route("test")]
public class TestController : BaseApiController
{
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;

    public TestController(INotificationService notificationService, IEmailService emailService)
    {
        _notificationService = notificationService;
        _emailService = emailService;
    }

    [HttpPost("create-notification")]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto request)
    {
        try
        {
            var userId = Guid.Empty;
            var notification = await _notificationService.CreateNotification(userId, request.Channel, request.Type, request.Title,
                request.Content);
            return CreateSuccessResponse(notification, "Create notification successfully");
        }
        catch (Exception ex)
        {
            return CreateErrorResponse(ex.Message, ErrorCodesConstants.InternalServerError);
        }
    }

    [HttpPost("send-email")]
    public async Task<IActionResult> SendEmail([FromBody] SendEmailRequestDto request)
    {
        try
        {
            await _emailService.SendEmail(request.NameTo, request.EmailTo, request.Title, request.Content);
            return CreateSuccessResponse(request, "Send email successfully");
        } 
        catch (Exception ex)
        {
            return CreateErrorResponse(ex.Message, ErrorCodesConstants.InternalServerError);
        }
    }
}

public record SendEmailRequestDto(string NameTo, string EmailTo, string Title, string Content){}