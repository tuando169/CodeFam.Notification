using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CodeFam.Notification.Constants
{
    public class RouteConstants
    {
        public const string Version = "api/v1";
        public static class Notification
        {
            public const string Base = Version + "/nofications";
            public const string GetAll = Version;
            public const string Read = Version;
            public const string ReadAll = Version + "/all";
        }
    }
}