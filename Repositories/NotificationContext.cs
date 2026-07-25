using Microsoft.EntityFrameworkCore;

namespace CodeFam.Notification.Repositories;

public class NotificationContext : DbContext
{
    public NotificationContext(DbContextOptions<NotificationContext> options) : base(options)
    { }
    public DbSet<CodeFam.Notification.Entities.Notification> Notifications { get; set; } = null!;
}
