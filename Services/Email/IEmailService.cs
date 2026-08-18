namespace CodeFam.Notification.Services.Email;

public interface IEmailService
{
    Task<bool> SendEmail(string userName,string userEmail, string title, string content);
}