namespace CodeFam.Notification.DTOs;

public record CreateNotificationDto(int Channel, int Type, string Title, string Content);