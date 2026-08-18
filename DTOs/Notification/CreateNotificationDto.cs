using CodeFam.Notification.Entities;

namespace CodeFam.Notification.DTOs.Notification;

public record CreateNotificationDto(NotificationChannelEnum Channel, int Type, string Title, string Content);