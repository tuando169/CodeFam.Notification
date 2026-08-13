using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace CodeFam.Notification.Helpers;

public static class JwtValidationHelper
{
    public static TokenValidationParameters GetTokenValidationParameters(IConfiguration configuration)
    {
        // 1. Đọc RSA Public Key từ appsettings.json hoặc file .pem/.key
        var publicKey = configuration["JwtSettings:PublicKey"];

        if (string.IsNullOrEmpty(publicKey))
        {
            throw new InvalidOperationException("RSA Public Key is missing in configuration.");
        }

        // 2. Load Public Key vào đối tượng RSA
        var rsa = RSA.Create();
        rsa.ImportFromPem(publicKey.ToCharArray());
        // 3. Tạo RsaSecurityKey từ RSA Provider
        var rsaSecurityKey = new RsaSecurityKey(rsa);

        // 4. Định nghĩa các tham số xác thực Token
        return new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = rsaSecurityKey, // Dùng Public Key để VERIFY chữ ký số
            ValidateIssuer = true,
            ValidIssuer = configuration["JwtSettings:Issuer"],

            ValidateAudience = true,
            ValidAudience = configuration["JwtSettings:Audience"],

            ValidateLifetime = true, // Kiểm tra hết hạn (exp)
            ClockSkew = TimeSpan.Zero // Không cho phép độ trễ thời gian (mặc định là 5 phút)
        };
    }
}