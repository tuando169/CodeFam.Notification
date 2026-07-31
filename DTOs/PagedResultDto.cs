using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeFam.Notification.DTOs
{
    public record PagedResultDto<T>(T Items, MetaData Meta);
}
