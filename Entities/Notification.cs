using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeFam.Notification.Entities;

public enum NotificationChannelEnum
{
    System = 1,
    Email = 2,
    Sms = 3,
    Push = 4
}

[Table("notifications")]
public class Notification
{
    [Key] [Column("id")] public Guid Id { get; set; }
    [Column("user_id")] public Guid UserId { get; set; }
    [Column("channel")] public NotificationChannelEnum Channel { get; set; }
    [Column("type")] public int Type { get; set; }
    [Column("title")] public string Title { get; set; } = string.Empty;
    [Column("content")] public string Content { get; set; } = string.Empty;
    [Column("is_read")] public bool IsRead { get; set; }
    [Column("read_at")] public DateTime? ReadAt { get; set; }
    [Column("created_at")] public DateTime? CreatedAt { get; set; }
    [Column("updated_at")] public DateTime? UpdatedAt { get; set; }
}