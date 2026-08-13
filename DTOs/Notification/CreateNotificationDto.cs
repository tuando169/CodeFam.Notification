namespace CodeFam.Notification.DTOs.Notification;

public record CreateNotificationDto(int Channel, int Type, string Title, string Content);