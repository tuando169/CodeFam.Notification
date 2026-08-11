using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CodeFam.Notification.Entities
{
    [Table("notifications")]
    public class Notification
    {
        [Key] [Column("id")] public Guid Id { get; set; }
        [Column("user_id")] public Guid UserId { get; set; }
        [Column("channel")] public int Channel { get; set; }
        [Column("type")] public int Type { get; set; }
        [Column("title")] public string Title { get; set; } = String.Empty;
        [Column("content")] public string Content { get; set; } = String.Empty;
        [Column("is_read")] public bool IsRead { get; set; }
        [Column("read_at")] public DateTime? ReadAt { get; set; }
        [Column("created_at")] public DateTime? CreatedAt { get; set; }
        [Column("updated_at")] public DateTime? UpdatedAt { get; set; }
    }
}