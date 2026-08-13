namespace CodeFam.Notification.DTOs;

public record PagedResultDto<T>(T Items, MetaData Meta);