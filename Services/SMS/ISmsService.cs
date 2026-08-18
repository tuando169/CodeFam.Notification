namespace CodeFam.Notification.Services.SMS;

public interface ISmsService
{
    Task<bool> SendSms(string to, string title, string content);
}