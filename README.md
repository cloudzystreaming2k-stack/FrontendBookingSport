# SportBooking Frontend 🏟️

Giao diện người dùng (Frontend) cho Website Đặt Sân Thể Thao, xây dựng với React và Vite.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

<div align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <br/>
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io Client" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet Maps" />
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=react&logoColor=white" alt="Recharts" />
</div>

- **Core:** React 18, Vite, TypeScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4, Radix UI (shadcn/ui primitives), Framer Motion (Animations)
- **State Management & Data Fetching:** React Hooks, Axios
- **Real-time:** Socket.io-client
- **Maps:** Leaflet & React-Leaflet
- **Authentication:** Google OAuth (`@react-oauth/google`), Facebook Login
- **Rich Text Editor:** Tiptap
- **Biểu đồ & Báo cáo:** Recharts, SheetJS (xlsx)

## 📋 Yêu Cầu Cài Đặt (Prerequisites)
1. [Node.js](https://nodejs.org/) (Khuyến nghị bản LTS - v18 hoặc v20)
2. Git
3. API Backend đang chạy (để kết nối lấy dữ liệu)

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án (Setup Guide)

### Bước 1: Clone dự án
```bash
git clone <đường_dẫn_git_repository_của_bạn>
cd datsanthethao/Webbookingsport
```

### Bước 2: Cài đặt thư viện (Dependencies)
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường (.env)
1. Copy file mẫu `.env.example` thành `.env` (nếu có) hoặc tạo file `.env` mới.
2. Thiết lập đường dẫn tới Backend API:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
```

### Bước 4: Chạy dự án
**Chế độ phát triển (Development):** Tự động hot-reload khi lưu code.
```bash
npm run dev
```
*(Frontend mặc định sẽ chạy ở địa chỉ: `http://localhost:5173`)*

**Chế độ Build (Production):**
```bash
npm run build
```

## 🗂️ Cấu Trúc Thư Mục Chính

Dự án được cấu trúc theo tính năng (Feature-based) kết hợp với các component tái sử dụng:

<details open>
<summary><b>Nhấn để xem/ẩn chi tiết cấu trúc</b></summary>

```text
Webbookingsport/
├── 📁 src/
│   ├── 🧩 components/   # UI Components tái sử dụng (Button, Input, Card, Modal...)
│   ├── 🌐 contexts/     # React Context (AuthContext, ThemeContext...)
│   ├── 🪝 hooks/        # Custom React Hooks (useDebounce, useChatbot...)
│   ├── 🖼️ layouts/      # Cấu trúc khung trang (RootLayout, AdminLayout, OwnerLayout)
│   ├── 🔌 lib/          # Cấu hình thư viện (Axios instance, utils...)
│   ├── 📄 pages/        # Các trang màn hình chính
│   │   ├── 👑 admin/    # Bảng điều khiển quản trị viên
│   │   ├── 🏪 owner/    # Bảng điều khiển cho chủ sân
│   │   └── (public)     # Các trang public (Home, Login, Courts...)
│   ├── 🎨 styles/       # CSS toàn cục (index.css)
│   ├── 📝 types/        # Định nghĩa TypeScript interfaces/types
│   ├── 🤖 App.tsx       # Component gốc (Router config)
│   └── ⚡ main.tsx      # Entry point của React
├── 📦 package.json      # Khai báo dependencies & scripts
└── ⚙️ vite.config.ts    # Cấu hình Vite bundler
```
</details>

## 🧩 Một Số Tính Năng Nổi Bật Ở Frontend
- **Hệ thống phân quyền:** Chia layout và menu linh hoạt theo Role (Admin, Owner, User).
- **Trải nghiệm mượt mà:** Sử dụng Sonner để hiện thông báo toast, Radix UI cho các popup/modal chuẩn Accessibility.
- **Biểu đồ & Thống kê:** Dashboard trực quan sử dụng Recharts, xuất báo cáo ra file Excel.
- **Bản đồ trực quan:** Tìm sân bằng bản đồ tương tác với Leaflet.
- **Tích hợp AI:** Nút chat nổi góc màn hình hỗ trợ người dùng bằng Gemini AI.



  # Website đặt sân thể thao

  This is a code bundle for Website đặt sân thể thao. The original project is available at https://www.figma.com/design/BR9iEzTzTl9SL6sXdYVr2q/Website-%C4%91%E1%BA%B7t-s%C3%A2n-th%E1%BB%83-thao.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.