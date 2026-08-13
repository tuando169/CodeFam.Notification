namespace CodeFam.Notification.DTOs.Notification;

public record GetNotificationListRequestDto(
    int Page = 1,
    int Limit = 10
);