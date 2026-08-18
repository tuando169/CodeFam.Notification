using CodeFam.Notification.DTOs;
using CodeFam.Notification.DTOs.Notification;
using CodeFam.Notification.Entities;

namespace CodeFam.Notification.Services;

public interface INotificationService
{
    Task<PagedResultDto<List<NotificationItemDto>>> GetUserNotification(Guid userId, int page = 1, int limit = 10);
    Task<bool> ReadNotification(Guid notificationId, Guid userId);
    Task<bool> ReadAllNotification(Guid userId);

    Task<NotificationItemDto> CreateNotification(Guid userId, NotificationChannelEnum channel, int type, string title, string content);
}