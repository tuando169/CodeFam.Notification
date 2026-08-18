namespace CodeFam.Notification.Constants;

public class RouteConstants
{
    public const string Version = "api/v1";

    public static class Notification
    {
        public const string Base = Version + "/notifications";
        public const string GetAll = Base;
        public const string Read = Base + "/read";
        public const string ReadAll = Read + "/all";
    }
}