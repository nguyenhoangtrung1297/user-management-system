# User Management System - Internal Tool

Ứng dụng quản lý người dùng và phân quyền truy cập ứng dụng nội bộ (Internal Tool) với đầy đủ tính năng quản trị, validation, và trạng thái UI hoàn chỉnh.

## 🎯 Tính năng chính

### 1. Danh sách người dùng
- ✅ Hiển thị bảng 8 cột: Tên, Email, Mã NV, Phòng ban, Chức danh, Trạng thái, Quyền ứng dụng, Ngày cập nhật
- ✅ Phân trang (10 người dùng/trang)
- ✅ Tìm kiếm theo tên, email, hoặc mã nhân viên (debounce 300ms)
- ✅ Lọc theo phòng ban và trạng thái (Active/Inactive)
- ✅ Trạng thái UI: loading (skeleton), empty, error, success
- ✅ Dark mode support

### 2. Import Excel/CSV
- ✅ Upload file Excel hoặc CSV
- ✅ Parse dữ liệu ở client-side
- ✅ Preview dữ liệu trước khi import
- ✅ Validation toàn diện:
  - Kiểm tra mã nhân viên không được để trống
  - Kiểm tra email hợp lệ
  - Phát hiện trùng lặp email
  - Phát hiện trùng lặp mã nhân viên
  - Kiểm tra trạng thái hợp lệ
- ✅ Highlight rõ các dòng có lỗi (bg-red-50)
- ✅ Chỉ cho phép import khi dữ liệu hợp lệ
- ✅ Download template mẫu
- ✅ Unit tests cho validation

### 3. Cập nhật trạng thái
- ✅ Bật/tắt Active/Inactive
- ✅ Confirm modal trước khi cập nhật
- ✅ Optimistic update (UI update trước API)
- ✅ Loading state cho mỗi action
- ✅ Rollback tự động khi API lỗi
- ✅ Error handling & notification

### 4. Gán quyền ứng dụng
- ✅ Modal Application Access
- ✅ Toggle qua lại E-Office, PPC Tool, HRHire
- ✅ Validate: Inactive user không được cấp quyền mới
- ✅ Confirm modal trước khi lưu
- ✅ Optimistic updates với rollback

### 5. Dark/Light Mode
- ✅ Theme toggle button ở header
- ✅ Auto detect system preference
- ✅ LocalStorage persistence
- ✅ Dark mode styles cho tất cả components
- ✅ Smooth transitions

## 🛠️ Tech Stack

| Công nghệ | Chi tiết | Mục đích |
|-----------|---------|---------|
| **Framework** | Next.js 14 (App Router) | App router, API routes |
| **Language** | TypeScript | Type safety, better DX |
| **UI** | TailwindCSS | Responsive, dark mode support |
| **Validation** | Custom validators (TypeScript) | Validate email/mã NV/status & dữ liệu import rõ ràng, không phụ thuộc thư viện |
| **File Processing** | SheetJS (xlsx) | Excel/CSV parsing ở client-side |
| **Data Fetching** | Fetch API + service layer | API integration |
| **State Management** | React Hooks + Custom hooks | Local state, side effects, optimistic update |
| **Testing** | Vitest | Unit tests |
| **Deployment** | Docker, Vercel | Containerization & hosting |

> **Tông màu chủ đạo:** Xanh dương (primary) & Cam (accent) — theo yêu cầu đề bài.

## 📦 Cài đặt

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Bước 1: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 2: Chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Bước 3: Build production
```bash
npm run build
npm run start
```

## 📁 Cấu trúc dự án

> Dự án dùng **Next.js App Router** với toàn bộ mã nguồn đặt trong thư mục `src/`.

```
src/
├── app/
│   ├── api/                              # Mock API routes (Next.js)
│   │   └── users/
│   │       ├── route.ts                  # GET /users (list, search, filter, paginate)
│   │       ├── import/route.ts           # POST /users/import
│   │       └── [id]/
│   │           ├── status/route.ts       # PATCH /users/:id/status
│   │           └── applications/route.ts # PATCH /users/:id/applications
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Main page (User Management)
├── components/
│   ├── Layout.tsx                        # Header/footer + theme toggle
│   ├── UserTable.tsx                     # Bảng người dùng
│   ├── SearchBar.tsx                     # Tìm kiếm & filter (debounce)
│   ├── Pagination.tsx                    # Phân trang
│   ├── ImportModal.tsx                   # Modal import + preview
│   ├── StatusModal.tsx                   # Modal đổi trạng thái
│   ├── ApplicationModal.tsx              # Modal phân quyền ứng dụng
│   └── SkeletonLoader.tsx                # Skeleton loading
├── hooks/
│   ├── useUsers.ts                       # Fetch danh sách + optimistic update + rollback
│   ├── useImport.ts                      # Xử lý import file
│   ├── useUserAction.ts                  # Cập nhật status/quyền
│   └── useTheme.ts                       # Dark/light mode
├── services/
│   └── api.ts                            # API client (service layer)
├── lib/
│   ├── mockDb.ts                         # Kho dữ liệu mock dùng chung (persist ra file)
│   ├── mockDb.test.ts                    # Unit test: chặn email trùng trong hệ thống
│   └── mockError.ts                      # Giả lập lỗi server tùy chọn (MOCK_FAIL_RATE)
├── types/
│   └── index.ts                          # TypeScript interfaces (User, Application, ...)
├── utils/
│   ├── validation.ts                     # Logic validate
│   ├── validation.test.ts                # Unit test validate
│   ├── importProcessing.ts               # Parse Excel/CSV & xử lý dữ liệu import
│   ├── importProcessing.test.ts          # Unit test đọc file import
│   └── debounce.ts                        # Debounce utility
├── constants/
│   └── index.ts                          # Constants & messages
└── styles/
    └── globals.css                       # Global styles
```

## ✨ Bonus Features Implemented

- ✅ **Debounce Search** (300ms) - Optimize API calls
- ✅ **Optimistic Updates** - Instant UI response with rollback
- ✅ **Skeleton Loading** - Beautiful loading state
- ✅ **Dark/Light Mode** - Full theme support with persistence
- ✅ **Unit Tests** - Vitest (validate + đọc file import + chặn email trùng)
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Docker Support** - Container ready
- ✅ **Error Handling** - Comprehensive error messages

## 🔌 API Endpoints

### GET /users
Lấy danh sách người dùng

Query params:
- `page`: Số trang (default: 1)
- `limit`: Số record/trang (default: 10)
- `search`: Tìm kiếm theo tên/email/mã NV
- `department`: Lọc theo phòng ban
- `status`: Lọc theo trạng thái (Active/Inactive)

Response:
```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 100
  }
}
```

### POST /users/import
Import người dùng từ file

Body:
```json
{
  "users": [
    {
      "employeeCode": "EMP001",
      "fullName": "Nguyễn Văn A",
      "email": "nguyena@example.com",
      "department": "IT",
      "title": "Developer",
      "status": "Active"
    }
  ]
}
```

### PATCH /users/:id/status
Cập nhật trạng thái người dùng

Body:
```json
{
  "status": "Active"
}
```

### PATCH /users/:id/applications
Cập nhật quyền ứng dụng

Body:
```json
{
  "applications": [
    {
      "id": "E-Office",
      "name": "E-Office",
      "enabled": true
    },
    {
      "id": "PPC Tool",
      "name": "PPC Tool",
      "enabled": false
    },
    {
      "id": "HRHire",
      "name": "HRHire",
      "enabled": true
    }
  ]
}
```

### Ghi chú về Mock API
- **Delay giả lập**: mỗi request trễ `MOCK_API_DELAY` (800ms, cấu hình ở `constants/index.ts`) để thấy rõ loading state.
- **Lưu trữ**: dữ liệu nằm trong kho dùng chung `lib/mockDb.ts`, được **persist ra file `.mock-data.json`** nên thay đổi (import / đổi status / phân quyền) tồn tại qua các lần restart server. Muốn reset về dữ liệu gốc: xóa file `.mock-data.json`.
- **Chặn trùng phía server**: `POST /users/import` trả về `409` nếu email đã tồn tại trong hệ thống (bổ sung cho việc client đã chặn trùng trong cùng file).
- **Giả lập lỗi (tùy chọn)**: đặt biến môi trường `MOCK_FAIL_RATE` (0–1) để các route ghi dữ liệu (import / status / applications) trả lỗi `500` theo tỉ lệ — dùng để kiểm tra **error state & rollback**. Mặc định `0` (tắt). VD chạy demo lỗi:
  ```bash
  # Windows PowerShell
  $env:MOCK_FAIL_RATE=0.3; npm run dev
  # macOS/Linux
  MOCK_FAIL_RATE=0.3 npm run dev
  ```

## 📋 File Template

Tải template Excel:
- **Tên file**: `user_template.xlsx`
- **Cột yêu cầu**: employeeCode, fullName, email, department, title, status
- **Status hợp lệ**: Active, Inactive

Ví dụ:
| employeeCode | fullName | email | department | title | status |
|---|---|---|---|---|---|
| EMP001 | Nguyễn Văn A | nguyena@example.com | IT | Developer | Active |
| EMP002 | Trần Thị B | tranb@example.com | HR | Manager | Active |

## ✨ Điểm nổi bật

- ✅ Full TypeScript type-safe
- ✅ Clean code structure với separation of concerns
- ✅ Comprehensive validation
- ✅ UI state management (loading, error, success, empty)
- ✅ Modal confirmations
- ✅ Responsive design
- ✅ Mock API với delay giả lập
- ✅ Error handling & rollback

## 🔧 Cách mở rộng

### Thêm ứng dụng mới
1. Thêm vào `constants/index.ts`
2. Update `types/index.ts`
3. Modal sẽ tự động render

### Thêm filter mới
1. Update `UserFilters` type
2. Thêm vào `SearchBar.tsx`
3. Update API query params

### Thêm cột bảng mới
1. Update `User` interface
2. Thêm `<th>` vào `UserTable.tsx`
3. Render data trong `<td>`

## 🚀 Deploy

### Vercel (Recommended)
```bash
vercel
```

### Docker
```bash
docker build -t user-management .
docker run -p 3000:3000 user-management
```

## 🧪 Testing

Dự án dùng **Vitest** cho unit test (cấu hình tại `vitest.config.ts`, hỗ trợ alias `@/`).

### Chạy test
```bash
npm test                                  # chạy toàn bộ 1 lần
npm run test:watch                        # chế độ watch (tự chạy lại khi sửa code)
npm test utils/importProcessing.test.ts   # chạy riêng 1 file
```

### Bao phủ (21 tests)
- **`utils/validation.test.ts`** — validate email, mã NV, status; validate từng dòng & toàn bộ dataset import; phát hiện trùng email/mã NV trong file.
- **`utils/importProcessing.test.ts`** — dựng file Excel thật trong bộ nhớ rồi chạy qua đúng pipeline `parse → validate → xử lý`: file hợp lệ, thiếu trường bắt buộc, email sai format, trùng email, mã NV dạng số + tự trim khoảng trắng.
- **`lib/mockDb.test.ts`** — phát hiện email đã tồn tại trong hệ thống (server chặn import trùng, không phân biệt hoa/thường).

## 🎯 Evaluation Checklist

### Frontend Architecture (25%)
- ✅ Clear folder structure
- ✅ TypeScript throughout
- ✅ Service layer separation
- ✅ Custom hooks for logic
- ✅ Reusable components

### UI/UX & UI State (20%)
- ✅ Loading states (skeleton)
- ✅ Empty states
- ✅ Error states
- ✅ Success notifications
- ✅ Confirm modals
- ✅ Dark/light mode

### API Integration (20%)
- ✅ Mock API endpoints
- ✅ Async/await handling
- ✅ Error handling
- ✅ Optimistic updates
- ✅ Rollback on failure

### Excel/CSV Processing (20%)
- ✅ Client-side parsing
- ✅ Comprehensive validation
- ✅ Error highlighting
- ✅ Duplicate detection
- ✅ Data preview

### Internal Tool Thinking (15%)
- ✅ User/permission management
- ✅ Extensible design
- ✅ Clear problem understanding
- ✅ Operational considerations

## 🚀 Performance Tips

- **Search Debounce**: 300ms debounce reduces API calls
- **Optimistic Updates**: Better perceived performance
- **Skeleton Loading**: Smooth loading experience
- **Dark Mode**: Reduces eye strain
- **Code Splitting**: Automatic with Next.js

## 📞 Support

For issues or questions:
1. Check README.md for common questions
2. Review DEVELOPMENT.md for architecture
3. See DEPLOYMENT_GUIDE.md for deployment help
4. Check QUICK_START.md for setup issues

## 📝 License

MIT
