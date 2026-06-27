# Quick Start Guide - 5 Phút Setup

## 🚀 Bước 1: Cài đặt (2 phút)

```bash
cd /Users/henry/Desktop/FRONT\ END
npm install
```

## 🎯 Bước 2: Chạy (1 phút)

```bash
npm run dev
```

Mở browser: http://localhost:3000

## ✅ Bước 3: Test các tính năng (2 phút)

### Danh sách người dùng
- Xem 6 người dùng mặc định
- Tìm kiếm theo tên, email, mã NV
- Lọc theo phòng ban (IT, HR, Finance, Sales, Marketing)
- Lọc theo trạng thái (Active, Inactive)
- Phân trang (10 người/trang)

### Import Excel
1. Click "+ Import Excel/CSV"
2. Click "↓ Tải template" → tải file template
3. Mở file, thêm dòng mới (hoặc test với dữ liệu mẫu)
4. Upload file → xem preview → click "Import dữ liệu"
5. Check danh sách (người vừa import sẽ có ID mới)

### Cập nhật trạng thái
1. Click "Trạng thái" trên bất kỳ người dùng nào
2. Xác nhận thay đổi
3. Xem notification thành công

### Gán quyền ứng dụng
1. Click "Quyền" trên bất kỳ người dùng nào
2. Toggle các ứng dụng (E-Office, PPC Tool, HRHire)
3. Click "Lưu"
4. Xem notification thành công
5. **Note**: Inactive user không thể nhận quyền mới

## 📁 File quan trọng

- `app/page.tsx` - Main page (logic chính)
- `components/` - UI components
- `hooks/` - Custom logic hooks
- `app/api/users/` - Mock API endpoints

## 🔧 Common commands

```bash
npm run dev          # Chạy dev server
npm run build        # Build production
npm start            # Chạy production
npm run lint         # Check code style
npm test             # Chạy tests
```

## 🐛 Gặp vấn đề?

### Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
npm run dev
```

### Module not found
```bash
rm -rf node_modules
npm install
```

### TypeScript errors
```bash
npx tsc --noEmit
```

## 📚 Tài liệu

- **README.md** - Tổng quan chi tiết
- **DEVELOPMENT.md** - Code style, patterns
- **DEPLOYMENT_GUIDE.md** - Deploy guide
- **PROJECT_SUMMARY.md** - Chi tiết mỗi file

## 🎓 Structure Overview

```
components/     → UI elements (Table, Modal, SearchBar, etc.)
hooks/          → Logic (useUsers, useImport, useUserAction)
services/       → API calls
app/api/        → Mock API endpoints
types/          → TypeScript interfaces
utils/          → Validation, processing
constants/      → Config values
```

## 🚀 Deploy

### Vercel (1 click)
1. Push code lên GitHub
2. Vào vercel.com → Connect repository
3. Done! (auto deploy mỗi lần push)

### Local
```bash
npm run build
npm start
```

## 🎯 Features checklist

- [x] User list with table, pagination, search, filter
- [x] Import Excel/CSV with validation & preview
- [x] Update status (Active/Inactive)
- [x] Manage application permissions
- [x] Mock API with all endpoints
- [x] Error handling & UI state
- [x] Responsive design
- [x] TypeScript throughout
- [x] Unit tests
- [x] Full documentation

## 💪 Ready to go!

Tất cả tính năng đã sẵn sàng để test. Code clean, documented, production-ready.

**Happy coding! 🎉**
