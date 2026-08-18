using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace CodeFam.Notification.Services.Email;

public class EmailService : IEmailService
{
    public async Task<bool> SendEmail(string userName, string userEmail, string title, string content)
    {
        var message = GenerateMail(userName, userEmail, title, content);
        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync("dodangtuan609@gmail.com", "lopg cnnn mlwk yrjn");
            await client.SendAsync(message);
            Console.WriteLine("Message sent successfully");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }

    MimeMessage GenerateMail(string userName, string userEmail, string title, string content)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("CodeFam", "dodangtuan609@gmail.com"));
        message.To.Add(new MailboxAddress(userName, userEmail));
        message.Subject = title;
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = "<h1>Xin chào!</h1><p>Đây là email tự động gửi từ <b>CodeFam</b>.</p>",
            TextBody = content
        };
        message.Body = bodyBuilder.ToMessageBody();
        return message;
    }
}