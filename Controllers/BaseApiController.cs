using CodeFam.Notification.Constants;
using CodeFam.Notification.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace CodeFam.Notification.Controllers;

[ApiController]
public abstract class BaseApiController : ControllerBase
{
    protected IActionResult CreateSuccessResponse<T>(T data, string message, MetaData? meta = null,
        int statusCode = 200)
    {
        var response = ApiResponse<T>.CreateSuccessResult(data, message, statusCode, meta, HttpContext.Request.Path);
        return StatusCode(statusCode, response);
    }

    protected IActionResult CreateErrorResponse(string message, ErrorCode errorCode,
        List<ValidationErrorDetail>? details = null)
    {
        var response = ApiResponse<object>.CreateErrorResult(
            message,
            statusCode: errorCode.Status,
            errorCode: errorCode.Code,
            details: details,
            path: HttpContext.Request.Path);
        return StatusCode(errorCode.Status, response);
    }
}