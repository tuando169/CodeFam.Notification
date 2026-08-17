# 🔔 Notification API Tester & Visual Simulator

Giao diện kiểm thử API thông báo tích hợp bộ mô phỏng trực quan 4 kênh thông báo (**SYSTEM**, **SMS**, **EMAIL**, **PUSH**) dành cho lập trình viên. Dự án được xây dựng hoàn toàn bằng **HTML5**, **CSS thuần**, **JavaScript thuần (Vanilla JS)** và **Tailwind CSS** (CDN).

---

## 🚀 Hướng Dẫn Cách Chạy Project

Bạn có thể chạy dự án bằng **2 cách** dưới đây:

### Cách 1: Chạy bằng Vite Dev Server (Khuyên dùng)

Dự án đã tích hợp sẵn **Vite** để hỗ trợ live-reloading khi phát triển.

1. Mở Terminal / PowerShell và di chuyển vào thư mục dự án:
   ```bash
   cd demo-api
   ```
2. Cài đặt các gói thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy máy chủ thử nghiệm cục bộ:
   ```bash
   npm run dev
   ```
4. Truy cập đường dẫn hiển thị ở terminal (mặc định: `http://localhost:5173`).

---

### Cách 2: Mở trực tiếp bằng Trình Duyệt (Không cần cài đặt Node.js)

Vì dự án dùng **JavaScript thuần (Vanilla JS)**, bạn chỉ cần:

- Click đúp chuột vào file `index.html` trong thư mục dự án.
- Hoặc kéo thả file `index.html` vào trình duyệt Chrome, Edge, Firefox, Brave,...

---

## 🛠️ Hướng Dẫn Sử Dụng Chi Tiết

### 1. 🟢 Nút "Mock Mode" (Chế Độ Giả Lập Offline)

- **Khi Bật (Màu xanh)**: Mọi thao tác gửi API sẽ được xử lý trực tiếp trên Cơ sở dữ liệu giả lập lưu trong `localStorage`. Bạn có thể thử nghiệm đầy đủ giao diện và bộ mô phỏng mà không cần bật server Backend thực tế.
- **Khi Tắt (Màu xám)**: Hệ thống sẽ thực hiện gọi lệnh HTTP request (`fetch`) trực tiếp tới Host và Path API bạn đã cấu hình.

---

### 2. ⚙️ Cấu Hình Host & Path API (Tự Động Lưu LocalStorage)

- **Base API Host**: Nhập URL gốc của server backend (ví dụ: `http://localhost:3000` hoặc `https://api.yourdomain.com`). Nhấn nút **Lưu** để ghi nhớ vào `localStorage`.
- **Path Override**: Mỗi tab API đều hỗ trợ ô nhập đường dẫn tùy chỉnh để ghi đè:
  - **1. Get List**: `/api/notifications` (truyền tham số query `page` và `limit`).
  - **2. Read One**: `/api/notifications/{id}/read` (hỗ trợ placeholder `{id}`).
  - **3. Read All**: `/api/notifications/read-all`.
  - **4. Create Notification**: `/api/notifications`.

---

### 3. 🧪 Các API Kiểm Thử & Định Dạng Hiển Thị

#### A. API Get List Notification

- **Tham số**: `page` và `limit`.
- **Kết quả trả về**: Hiển thị chuỗi JSON thô có highlight màu sắc tại khung **Console Log**.
- **Hiển thị danh sách UI (Rendered Cards)**:
  - Viền trái thể hiện màu theo từng **Channel**:
    - 🔵 `SYSTEM`: Viền xanh dương
    - 🟢 `EMAIL`: Viền xanh lá
    - 🟡 `SMS`: Viền vàng cam
    - 🟣 `PUSH`: Viền tím
  - **Trạng thái Chưa Đọc (`isRead = false`)**: Hiển thị chấm đỏ nhấp nháy (`pulse-dot`) cùng nút **Đọc** để test nhanh API đánh dấu 1 thông báo là đã đọc.

#### B. API Read Notification (Đọc 1 thông báo)

- **Tham số**: Truyền vào `id` của thông báo.
- **Kết quả**: Trả về trạng thái thành công hoặc thất bại.

#### C. API Read All Notification (Đọc tất cả thông báo)

- **Tham số**: Không truyền tham số.
- **Kết quả**: Đánh dấu tất cả thông báo trong danh sách là đã đọc (`isRead = true`).

#### D. API Create Notification (Tạo thông báo mới)

- **Tham số**: Truyền vào 1 JSON Object. Cung cấp 4 nút template nhanh (**SYSTEM**, **SMS**, **EMAIL**, **PUSH**) giúp tạo payload mẫu nhanh chóng.
- **Tự động kích hoạt Visual Simulator tương ứng khi gửi thành công**:
  - 🔔 **SYSTEM**: Icon Chuông báo ở Header sẽ rung lắc (wobble), cập nhật số lượng badge đỏ chưa đọc và mở danh sách thông báo Dropdown.
  - 💬 **SMS**: Chuyển điện thoại mô phỏng sang màn hình nhắn tin với `Noti Bot`, chèn tin nhắn SMS mới kèm hiệu ứng cuộn mượt.
  - 📧 **EMAIL**: Chuyển sang giao diện Gmail máy tính, thư mới sẽ xuất hiện ở đầu Hộp thư đến (in đậm). Nhấp vào thư để mở giao diện đọc chi tiết.
  - 📲 **PUSH**: Chuyển sang màn hình khóa điện thoại, trượt một thanh thông báo đẩy (Push Banner) từ trên xuống và tự động thu gọn sau 5 giây.

---

## 📁 Cấu Trúc Mã Nguồn

```text
demo-api/
├── index.html       # Bố cục HTML chính (API Form + Console + Simulators)
├── style.css        # Custom CSS, hiệu ứng Keyframes animation & Mockup Devices
├── app.js           # Logic điều hướng API, LocalStorage, Mock DB & Event Handlers
├── package.json     # Cấu hình dự án & Script khởi chạy Vite
└── README.md        # File hướng dẫn chi tiết cách chạy và sử dụng
```
