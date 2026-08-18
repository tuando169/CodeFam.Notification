namespace CodeFam.Notification.Services.Email;

public interface IEmailService
{
    Task<bool> SendEmail(string to, string subject, string content);
}