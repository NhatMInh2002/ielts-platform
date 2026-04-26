# IELTS Platform - Project Diary & Changelog

Đây là file nhật ký để theo dõi tiến độ phát triển dự án, các quyết định kiến trúc và các thay đổi quan trọng theo thời gian.

---

## [2026-04-26] Phase 1: Khởi tạo và Thiết lập Database

**1. Khởi tạo Project & UI Framework**
- Khởi tạo thành công dự án với Next.js (App Router), TypeScript.
- Cài đặt Tailwind CSS v4 và cấu hình hệ thống màu chuẩn (IELTS theme) trong `tailwind.config.ts`. Đã fix lỗi type `darkMode`.
- Tích hợp Shadcn UI và cài đặt 10 components cơ bản (button, card, input, tabs, dialog, progress...).

**2. Quản lý mã nguồn & Môi trường**
- Thiết lập file `.gitignore` chuẩn.
- Cấu hình file biến môi trường `.env.local` với các Key của Supabase và NextAuth.

**3. Chuyển đổi AI Provider (Quyết định quan trọng)**
- **Lý do**: Tối ưu chi phí để xử lý số lượng lớn bài chấm Writing/Speaking.
- **Hành động**: 
  - Gỡ bỏ thư viện Anthropic SDK, cài đặt `@google/generative-ai`.
  - Cập nhật toàn bộ các file tài liệu định hướng (`PLAN.md`, `SETUP_GUIDE.md`, `CLAUDE.md`, `STRUCTURE.md`, `DATABASE_DESIGN.md`) từ Claude sang **Google Gemini 1.5 Flash**.
  - Bổ sung `GEMINI_API_KEY` vào `.env.local`.

**4. Thiết kế & Khởi tạo Database**
- Sử dụng Prisma 7.8.0 với PostgreSQL (Supabase).
- Di chuyển cấu hình `DATABASE_URL` sang `prisma.config.ts` cho tương thích với version mới của Prisma.
- Xây dựng schema hoàn chỉnh (26 bảng) bao gồm các Module: Auth, Listening, Reading, Writing, Speaking, Vocabulary (thuật toán Leitner), Progress Tracking, v.v.
- Đã sửa lỗi syntax (Date -> DateTime).
- **Thành quả**: Chạy thành công `npx prisma migrate dev --name init`. Database Supabase đã đồng bộ 100% với schema.

---

## [2026-04-26] Phase 2: Authentication System (Migrated)

**1. Khởi tạo ban đầu (Legacy)**
- Đã từng thiết lập NextAuth và Prisma, nhưng sau đó đã chuyển đổi sang Supabase Auth để tối ưu và fix lỗi engine trên Windows.

---

## [2026-04-26] Phase 2.5: Re-architecture - Chuyển sang Supabase Auth (Quyết định quan trọng)

**1. Thay đổi kiến trúc (Architecture Shift)**
- **Lý do**: Gặp lỗi `ERR_STREAM_UNABLE_TO_PIPE` và `PrismaClientConstructorValidationError` của Prisma 7 trên môi trường Windows/Next.js 16/Turbopack.
- **Hành động**: 
  - Gỡ bỏ hoàn toàn **Prisma** và **NextAuth**.
  - Chuyển sang sử dụng **Supabase SDK (`@supabase/supabase-js`)** và **Supabase Auth (`@supabase/ssr`)**.
  - Xóa bỏ các file liên quan: `prisma/`, `lib/prisma.ts`, `lib/auth.ts`, `app/api/auth/[...nextauth]`.

**2. Thiết lập Supabase Auth & SSR**
- Cài đặt `@supabase/ssr` cho Next.js App Router.
- Khởi tạo hệ thống Client Utilities trong `lib/supabase/`:
  - `server.ts`: Client chạy phía server (cho Server Actions & Server Components).
  - `client.ts`: Client chạy phía trình duyệt (cho Client Components).
  - `middleware.ts`: Quản lý việc làm mới (refresh) session tự động.
- Cấu hình `middleware.ts` ở root để bảo mật session toàn cục.
- Thiết lập Server Actions (`app/(auth)/actions.ts`) để xử lý logic: Login, Signup, Signout.
- Tạo route callback `app/api/auth/callback/route.ts` để hỗ trợ Google OAuth 2.0.

**3. Cập nhật giao diện Auth**
- Viết lại trang **Login** và **Register** sử dụng trực tiếp Server Actions của Supabase.
- Chuyển từ quản lý session client-side (NextAuth) sang quản lý session server-side (Supabase Cookies).
- Sửa lỗi cấu trúc thư mục (fix lỗi lồng thư mục `login/login`).

---

## 🎯 Mục tiêu tiếp theo (Next Steps)
- Xây dựng trang Landing Page chuyên nghiệp.
- Thiết kế Dashboard cho người dùng sau khi đăng nhập.
- Triển khai các Module học tập (Reading, Writing...).
