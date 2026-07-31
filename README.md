# CodeFam.Notification

CodeFam.Notification là một dự án .NET dùng để xây dựng và quản lý các chức năng thông báo (notification) cho ứng dụng. Dự án hiện đang ở giai đoạn khởi tạo và tập trung vào lớp `NotificationService` trong thư mục `Services`.

## Mục tiêu

- Cung cấp một nơi tập trung để xử lý logic gửi và quản lý thông báo.
- Dễ dàng mở rộng cho nhiều kênh thông báo như email, SMS, push notification,...

## Yêu cầu

- .NET SDK 8.0 trở lên

## Cài đặt

Mở terminal tại thư mục dự án và chạy:

```powershell
cd d:\Workspace\code-fam\CodeFam.Notification
dotnet restore
```

## Build

```powershell
dotnet build
```

## Chạy

- Nếu dự án này được dùng như một ứng dụng console hoặc web service, chạy:

```powershell
dotnet run
```

- Nếu đây là một thư viện để dùng trong các dự án khác, chỉ cần build là đủ:

```powershell
dotnet build
```
