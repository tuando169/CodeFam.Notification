using CodeFam.Notification.Helpers;
using CodeFam.Notification.Repositories;
using CodeFam.Notification.Services;
using CodeFam.Notification.Services.Email;
using CodeFam.Notification.Services.SMS;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // 1. Định nghĩa Security Scheme (Xác thực Bearer)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name= "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });
    // 2. Bật yêu cầu Security cho tất cả Endpoints trên Swagger
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = JwtValidationHelper.GetTokenValidationParameters(builder.Configuration);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Hoặc .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddDbContextFactory<NotificationContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddSingleton<ISmsService, SmsService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<INotificationService, NotificationService>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // 💡 IN THÊM LINK SWAGGER RA CONSOLE KHI CHẠY DEVELOPMENT
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var addresses = app.Services.GetRequiredService<Microsoft.AspNetCore.Hosting.Server.IServer>()
            .Features.Get<Microsoft.AspNetCore.Hosting.Server.Features.IServerAddressesFeature>()?.Addresses;

        if (addresses != null)
        {
            foreach (var address in addresses)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"--> Swagger UI is available at: {address}/swagger");
                Console.ResetColor();
            }
        }
    });
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAll");
app.UseAuthentication(); // 1. Xác thực (Đọc và decode Token)
app.UseAuthorization(); // 2. Phân quyền (Kiểm tra thẻ [Authorize])
app.MapControllers();

app.Run();