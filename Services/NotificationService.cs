using CodeFam.Notification.DTOs;
using CodeFam.Notification.Repositories;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CodeFam.Notification.Services
{

    public class NotificationService : INotificationService
    {
        private readonly NotificationContext context;
        private readonly ILogger<NotificationService> logger;

        public async Task<GetNotificationListResponse> GetUserNotification(Guid userId, int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            var query = context.Notifications.AsNoTracking().Where(n => n.UserId == userId).ToListAsync();
            return;
        }
        public async Task<bool> ReadNotification(Guid userId, Guid notificationId)
        {
            var query = context.Notifications.AsNoTracking().Where(n => n.Id == notificationId).FirstOrDefault();
            if (query.UserId != userId) throw new Exception()
            return;
        }
        public async Task<GetNotificationListResponse> GetUserNotification(Guid userId, int pageNumber = 1, int pageSize = 10)
        {
            var query = context.Notifications.AsNoTracking().Where(n => n.UserId == userId);
            return;
        }



    }
}