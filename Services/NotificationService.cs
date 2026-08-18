using CodeFam.Notification.Constants;
using CodeFam.Notification.DTOs;
using CodeFam.Notification.DTOs.Notification;
using CodeFam.Notification.Entities;
using CodeFam.Notification.Repositories;
using CodeFam.Notification.Services.Email;
using CodeFam.Notification.Services.SMS;
using Microsoft.EntityFrameworkCore;

namespace CodeFam.Notification.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IDbContextFactory<NotificationContext> _contextFactory;
        private readonly ILogger<NotificationService> _logger;
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;

        public NotificationService(IDbContextFactory<NotificationContext> contextFactory,
            ILogger<NotificationService> logger, IEmailService emailService, ISmsService smsService)
        {
            _contextFactory = contextFactory;
            _logger = logger;
            _emailService = emailService;
            _smsService = smsService;
        }

        public async Task<PagedResultDto<List<NotificationItemDto>>> GetUserNotification(Guid userId, int page = 1,
            int limit = 10)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            if (page < 1) page = 1;
            if (limit < 1) limit = 10;
            var allNotifications =
                await context.Notifications.AsNoTracking().Where(n =>
                    n.UserId == userId && n.Channel == NotificationChannelEnum.System &&
                    n.Channel == NotificationChannelEnum.Push).ToListAsync();
            var totalItems = allNotifications.Count();
            var totalPages = (int)Math.Ceiling((double)totalItems / limit);
            var items = allNotifications.OrderByDescending(n => n.CreatedAt).Skip((page - 1) * limit).Take(limit)
                .Select(n =>
                    new NotificationItemDto(n.Id, n.UserId, n.Channel, n.Type, n.Title, n.Content, n.IsRead, n.ReadAt,
                        n.CreatedAt, n.UpdatedAt)).ToList();
            return new PagedResultDto<List<NotificationItemDto>>(items,
                new MetaData { Limit = limit, Page = page, TotalItems = totalItems, TotalPages = totalPages });
        }

        public async Task<bool> ReadNotification(Guid userId, Guid notificationId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            var foundNotification = await context.Notifications
                .Where(n => n.UserId == userId && n.Id == notificationId).FirstOrDefaultAsync();
            if (foundNotification == null) throw new Exception(ErrorCodesConstants.NotFound.Code);
            foundNotification.IsRead = true;
            foundNotification.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ReadAllNotification(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            await context.Notifications.Where(n => n.UserId == userId && !n.IsRead)
                .ExecuteUpdateAsync(noti => noti
                    .SetProperty(n => n.IsRead, true)
                    .SetProperty(n => n.UpdatedAt, DateTime.UtcNow));
            return true;
        }

        public async Task<NotificationItemDto> CreateNotification(Guid userId, NotificationChannelEnum channel,
            int type, string title,
            string content)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            var entity = new Entities.Notification()
            {
                UserId = userId,
                Content = content,
                Channel = channel,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                Title = title,
                Type = type
            };
            context.Notifications.Add(entity);
            await context.SaveChangesAsync();
            await SendThirdPartyNotification(userId, channel, type, title, content);
            return new NotificationItemDto(entity.Id, entity.UserId, entity.Channel, entity.Type, entity.Title,
                entity.Content, entity.IsRead, entity.ReadAt, entity.CreatedAt, entity.UpdatedAt);
        }

        async Task SendThirdPartyNotification(Guid userId, NotificationChannelEnum channel, int type,
            string title, string content)
        {
            if (channel == NotificationChannelEnum.Email)
            {
                //TODO: get user email by user service
                var user = new { Name = "Do Dang Tuan", Email = "dodangtuan609@gmail.com" };
                await _emailService.SendEmail(user.Name, user.Email, title, content);
            }
            else if (channel == NotificationChannelEnum.Sms)
            {
                //TODO: get user phone by user service
                var phoneNumber = "0966135609";
                await _smsService.SendSms(phoneNumber, title, content);
            }
        }
    }
}