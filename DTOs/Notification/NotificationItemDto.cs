using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeFam.Notification.DTOs
{
    public record NotificationItemDto(Guid Id, Guid UserId, int Channel, int Type, string Title, string Content, bool IsRead, DateTime? ReadAt, DateTime? CreatedAt, DateTime? UpdatedAt);
}