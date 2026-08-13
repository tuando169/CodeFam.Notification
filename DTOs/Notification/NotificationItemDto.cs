namespace CodeFam.Notification.DTOs.Notification;

public record NotificationItemDto(
    Guid Id,
    Guid UserId,
    int Channel,
    int Type,
    string Title,
    string Content,
    bool IsRead,
    DateTime? ReadAt,
    DateTime? CreatedAt,
    DateTime? UpdatedAt);