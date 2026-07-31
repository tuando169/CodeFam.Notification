using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CodeFam.Notification.DTOs
{
    public record GetNotificationListRequestDto(
        int Page = 1,
        int Limit = 10
    );
}