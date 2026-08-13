using Microsoft.EntityFrameworkCore;

namespace CodeFam.Notification.Repositories;

public class NotificationContext(DbContextOptions<NotificationContext> options) : DbContext(options)
{
    public DbSet<Entities.Notification> Notifications { get; set; } = null!;
}