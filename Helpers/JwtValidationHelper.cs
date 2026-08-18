using System.Security.Cryptography;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace CodeFam.Notification.Helpers;

public static class JwtValidationHelper
{
    public static TokenValidationParameters GetTokenValidationParameters(IConfiguration configuration)
    {
        // 1. Đọc RSA Public Key từ appsettings.json hoặc file .pem/.key
        var configuredPublicKey = configuration["JwtSettings:PublicKey"];

        if (string.IsNullOrWhiteSpace(configuredPublicKey))
        {
            throw new InvalidOperationException("RSA Public Key is missing in configuration.");
        }

        var publicKey = configuredPublicKey;
        if (!configuredPublicKey.Contains("-----BEGIN", StringComparison.Ordinal))
        {
            var keyPath = Path.IsPathRooted(configuredPublicKey)
                ? configuredPublicKey
                : Path.Combine(AppContext.BaseDirectory, configuredPublicKey);

            if (!File.Exists(keyPath))
            {
                throw new FileNotFoundException("RSA Public Key file was not found.", keyPath);
            }

            publicKey = File.ReadAllText(keyPath);
        }

        // 2. Load Public Key vào đối tượng RSA
        var rsa = RSA.Create();
        rsa.ImportFromPem(publicKey.ToCharArray());
        // 3. Tạo RsaSecurityKey từ RSA Provider
        var rsaSecurityKey = new RsaSecurityKey(rsa);

        // 4. Định nghĩa các tham số xác thực Token
        return new TokenValidationParameters
        {
            ValidateIssuerSigningKey = false,
            RequireSignedTokens = false,

            // SỬA TẠI ĐÂY: Trả về JsonWebToken thay vì JwtSecurityToken
            SignatureValidator = (token, parameters) => new JsonWebToken(token),

            ValidateIssuer = true,
            ValidIssuer = configuration["JwtSettings:Issuer"],

            ValidateAudience = true,
            ValidAudience = configuration["JwtSettings:Audience"],

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    }
}