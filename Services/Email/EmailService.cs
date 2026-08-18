namespace CodeFam.Notification.Services.Email;

public class EmailService:IEmailService
{
    public Task<bool> SendEmail(string to, string subject, string content)
    {
        throw new NotImplementedException();
    }
}