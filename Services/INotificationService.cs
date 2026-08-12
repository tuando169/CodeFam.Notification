using CodeFam.Notification.DTOs;

namespace CodeFam.Notification.Services
{
    public interface INotificationService
    {
        Task<PagedResultDto<List<NotificationItemDto>>> GetUserNotification(Guid userId, int page = 1, int limit = 10);
        Task<bool> ReadNotification(Guid notifactionId, Guid userId);
        Task<bool> ReadAllNotification(Guid userId);

        Task<NotificationItemDto> CreateNotification(Guid userId, int channel, int type, string title, string content);
    }
}