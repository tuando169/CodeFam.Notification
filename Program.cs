using CodeFam.Notification.Repositories;
using CodeFam.Notification.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContextFactory<NotificationContext>(options => options.UseNpgsql(connectionString));

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

app.MapControllers();

app.Run();