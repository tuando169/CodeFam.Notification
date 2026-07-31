namespace CodeFam.Notification.Constants;

public class ErrorCode
{
    public string Code { get; }
    public int Status { get; }

    public ErrorCode(string code, int defaultHttpStatus)
    {
        Code = code;
        Status = defaultHttpStatus;
    }
}

public static class ErrorCodesConstants
{
    public static readonly ErrorCode ValidationError = new("VALIDATION_ERROR", 400);

    public static readonly ErrorCode Unauthorized = new("UNAUTHORIZED", 401);
    public static readonly ErrorCode Forbidden = new("FORBIDDEN", 403);

    public static readonly ErrorCode NotFound = new("NOT_FOUND", 404);

    public static readonly ErrorCode Conflict = new("CONFLICT", 409);
    public static readonly ErrorCode OrderInvalidStatus = new("ORDER_INVALID_STATUS", 409);
    public static readonly ErrorCode PaymentFailed = new("PAYMENT_FAILED", 409);
    public static readonly ErrorCode LicenseOutOfStock = new("LICENSE_OUT_OF_STOCK", 409);

    public static readonly ErrorCode ServiceUnavailable = new("SERVICE_UNAVAILABLE", 503);
    public static readonly ErrorCode InternalServerError = new("INTERNAL_SERVER_ERROR", 500);
}