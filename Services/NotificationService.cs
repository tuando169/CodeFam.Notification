using CodeFam.Notification.DTOs;
using CodeFam.Notification.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CodeFam.Notification.Services
{

    public class NotificationService : INotificationService
    {
        private readonly NotificationContext context;
        private readonly ILogger<NotificationService> logger;

        public async Task<PagedResultDto<List<NotificationItemDto>>> GetUserNotification(Guid userId, int page = 1, int limit = 10)
        {
            if (page < 1) page = 1;
            if (limit < 1) limit = 10;
            var query = context.Notifications.AsNoTracking().Where(n => n.UserId == userId);
            var totalItems = query.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / page);
            var items = await query.OrderByDescending(n => n.CreatedAt).Skip((page - 1) * limit).Take(limit).Select(n => new NotificationItemDto(n.Id, n.UserId, n.Channel, n.Type, n.Title, n.Content, n.IsRead, n.ReadAt, n.CreatedAt, n.UpdatedAt)).ToListAsync();
            return new PagedResultDto<List<NotificationItemDto>>(items, new MetaData { Limit = limit, Page = page, TotalItems = totalItems, TotalPages = totalPages });
        }
        public async Task<bool> ReadNotification(Guid userId, Guid notificationId)
        {
            var result = await context.Notifications.AsNoTracking().Where(n => n.UserId == userId && n.Id == notificationId).FirstOrDefaultAsync();
            if (result == null) throw new Exception();
await context.Notifications.Update()
            return true;
        }
        public async Task<bool> ReadAllNotification(Guid userId)
        {
            var query = context.Notifications.AsNoTracking().Where(n => n.UserId == userId && !n.IsRead).Select(n => new CodeFam.Notification.Entities.Notification
            {
                Id = n.Id,
                IsRead = !n.IsRead,
                UpdatedAt = DateTime.Now
            });
            return true;
        }
    }
}