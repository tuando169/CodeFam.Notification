using System.Security.Claims;

namespace CodeFam.Notification.Helpers;

public static class HttpContextHelper
{
    public static Guid GetRequestUserId(this ClaimsPrincipal? user)
    {
        if (user == null) return Guid.Empty;

        var userId = user.FindFirstValue("user");
        if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException();
        return Guid.Parse(userId);
    }
}