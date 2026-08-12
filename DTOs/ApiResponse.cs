using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CodeFam.Notification.DTOs
{
    public class MetaData
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }

    public class ValidationErrorDetail
    {
        public string Field { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class ErrorDetail
    {
        public string Code { get; set; } = string.Empty;
        public List<ValidationErrorDetail>? Details { get; set; }
    }


    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public T? Data { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MetaData? Meta { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public ErrorDetail? Error { get; set; }
        public string Timestamp { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        public string Path { get; set; } = string.Empty;

        public static ApiResponse<T> CreateSuccessResult(T data, string message, int statusCode = 200, MetaData? meta = null, string path = "")
        {
            return new ApiResponse<T>
            {
                Success = true,
                StatusCode = statusCode,
                Message = message,
                Data = data,
                Meta = meta,
                Path = path
            };
        }

        public static ApiResponse<T> CreateErrorResult(string message, string errorCode, int statusCode = 500, List<ValidationErrorDetail>? details = null, string path = "")
        {
            return new ApiResponse<T>
            {
                Success = false,
                StatusCode = statusCode,
                Message = message,
                Error = new ErrorDetail
                {
                    Code = errorCode,
                    Details = details
                },
                Path = path
            };
        }


    }
}