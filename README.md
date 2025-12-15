# 🛍️ TechZone – Fullstack E-commerce System

Đồ án 1 | Ứng dụng mua sắm laptop trực tuyến | Fullstack với **React + Node.js + Prisma**

---

## 📘 Tổng quan

**TechZone** là một nền tảng thương mại điện tử mini, cho phép người dùng:

- Đăng ký / đăng nhập / xác thực email
- Quản lý thông tin cá nhân
- Xem và mua sản phẩm laptop
- Quản lý đơn hàng và thanh toán (trong tương lai)

Dự án bao gồm:

- 🧠 **Backend**: REST API với Node.js, Express, Prisma, JWT, Argon2
- 💻 **Frontend**: React + Vite + React-Bootstrap + Axios
- 🗄️ **Database**: PostgresSQL

---

## ⚙️ Công nghệ chính

| Phần         | Công nghệ                               | Mô tả                            |
| ------------ | --------------------------------------- | -------------------------------- |
| **Frontend** | React, React-Bootstrap, Axios           | Giao diện web hiện đại           |
| **Backend**  | Node.js, Express.js, Prisma ORM, Argon2 | Xử lý logic & API                |
| **Auth**     | JWT, Cookies, Email Verification        | Hệ thống xác thực                |
| **Mailer**   | Nodemailer + Gmail App Password         | Gửi mail xác thực/reset password |
| **Database** | PostgresSQL                             | Lưu trữ dữ liệu                  |
| **Job**      | node-cron / cleanupJob                  | Xóa tài khoản chưa xác thực      |

---

🧰 Cài đặt và chạy toàn bộ dự án
⚙️ Yêu cầu
Node.js >= 18

PostgresSQL

Git

1️⃣ Clone project
bash
Sao chép mã
git clone https://github.com/dangngockhieu/Ecommerce.git
cd Ecommerce
2️⃣ Cài đặt Backend
bash
Sao chép mã
cd backend
npm install
Tạo file .env dựa trên .env.example

3️⃣ Tạo và migrate database
bash
Sao chép mã
npx prisma migrate dev --name init
npx prisma generate
4️⃣ Seed dữ liệu mặc định
Backend sẽ tự động seed khi khởi động lần đầu.
5️⃣ Chạy Backend server
bash
Sao chép mã
npm run dev
6️⃣ Cài đặt Frontend
Mở terminal mới:

bash
Sao chép mã
cd ../frontend
npm install
Tạo file .env trong thư mục frontend

7️⃣ Chạy Frontend
bash
Sao chép mã
npm run dev
🔐 Các tính năng chính
Nhóm Tính năng Mô tả
Auth Đăng ký / Đăng nhập / Đăng xuất Có xác thực email và token
Email Xác thực qua email Gửi link xác minh
Token Làm mới token JWT + refresh token
Reset Password Gửi mã đặt lại qua email Có hạn dùng
User Cập nhật thông tin cá nhân Sửa đổi thông tin
Admin Quản lý người dùng / sản phẩm CRUD nâng cao

🧠 Dev Notes
Mật khẩu được mã hóa bằng Argon2

Token được ký bằng JWT (access + refresh)

Xác thực qua HTTP-only Cookie

Prisma được khởi tạo theo Singleton pattern để tránh leak connection

```

```
