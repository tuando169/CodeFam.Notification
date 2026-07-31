using CodeFam.Notification.DTOs;

namespace CodeFam.Notification.Services
{
    public interface INotificationService
    {
        Task<ApiResponse<GetNotificationListResponse>> GetUserNotification(Guid userId, int pageNumber = 1, int pageSize = 10);
        Task<ApiResponse<bool>> ReadNotification(Guid notifactionId, Guid userId);
        Task<ApiResponse<bool>> ReadAllNotification(Guid userId);
    }
}