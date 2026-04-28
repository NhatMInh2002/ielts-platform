# 🧪 IELTS Mastery Platform - Kế hoạch Kiểm thử (Test Plan)

Tài liệu này dùng để theo dõi trạng thái kiểm thử và rà soát lỗi trên toàn bộ hệ thống.

## 📋 Điều kiện tiên quyết (Prerequisites)
1. **Database**: Chạy toàn bộ nội dung file `MIGRATION.sql` trong Supabase SQL Editor.
2. **Admin Account**: 
   - Đăng ký một tài khoản bất kỳ qua giao diện `/register`.
   - Sử dụng lệnh SQL ở cuối file `MIGRATION.sql` để cấp quyền `admin` cho tài khoản đó.
3. **Môi trường**: Đảm bảo file `proxy.ts` đã được cấu hình đúng (Next.js 16).

---

## 🔐 1. Authentication & User Profile (Xác thực & Hồ sơ)
- [ ] **TC-01**: Đăng ký tài khoản mới bằng Email/Password (Kiểm tra Trigger tạo Profile tự động).
- [ ] **TC-02**: Đăng nhập bằng tài khoản vừa tạo.
- [ ] **TC-03**: Đăng nhập bằng Google (Kiểm tra tích hợp OAuth - Kiểm tra Redirect URI).
- [ ] **TC-04**: Đăng xuất và thử truy cập lại Dashboard (Kiểm tra bảo mật Middleware/Proxy).
- [ ] **TC-05**: Kiểm tra hiển thị tên người dùng và Avatar trên Sidebar.

## 📊 2. Student Dashboard (Bảng điều khiển học viên)
- [ ] **TC-06**: Kiểm tra hiển thị số lượng AI Tokens (Có đúng với Database không?).
- [ ] **TC-07**: Kiểm tra danh sách "Recent Activity" (Có hiển thị bài làm mới nhất không?).
- [ ] **TC-08**: Kiểm tra các chỉ số Band điểm trung bình trên Dashboard.

## ✍️ 3. Writing Module (Kỹ năng Viết)
- [ ] **TC-09**: Kiểm tra đồng hồ đếm ngược (Có dừng lại khi nộp bài hoặc hết giờ không?).
- [ ] **TC-10**: Kiểm tra bộ đếm từ (Word Count) thực tế khi đang gõ.
- [ ] **TC-11**: Kiểm tra luồng nộp bài khi **Hết Token** (Hệ thống phải chặn và thông báo).
- [ ] **TC-12**: Kiểm tra kết quả AI Gemini (JSON có bị lỗi hiển thị không?).
- [ ] **TC-13**: Kiểm tra trang kết quả (Báo lỗi sai, gợi ý sửa lỗi có hiển thị đúng không?).

## 📖 4. Reading Module (Kỹ năng Đọc)
- [ ] **TC-14**: Kiểm tra giao diện Split-screen (Cả 2 bên có cuộn độc lập mượt mà không?).
- [ ] **TC-15**: Kiểm tra tính năng Highlight (Bôi đen văn bản có đổi màu vàng không?).
- [ ] **TC-16**: Kiểm tra chấm điểm tự động (So khớp đáp án đúng/sai).
- [ ] **TC-17**: Kiểm tra hiển thị giải thích (Explanation) ở trang kết quả.

## 🎧 5. Listening Module (Kỹ năng Nghe)
- [ ] **TC-18**: Kiểm tra trình phát âm thanh (Play/Pause, Tua, Thay đổi âm lượng).
- [ ] **TC-19**: Kiểm tra âm thanh có tiếp tục phát khi người dùng cuộn xuống làm bài không?.
- [ ] **TC-20**: Kiểm tra lưu kết quả bài nghe vào Database.

## 🎤 6. Speaking Module (Kỹ năng Nói)
- [ ] **TC-21**: Kiểm tra quyền truy cập Microphone (Có hiện thông báo xin quyền không?).
- [ ] **TC-22**: Kiểm tra quá trình ghi âm (Sóng âm, đồng hồ đếm giây).
- [ ] **TC-23**: Kiểm tra tính năng "Thử lại" (Retry) - có xóa bản ghi cũ để ghi lại không?.

## 🛠 7. Admin Dashboard (Quản trị viên)
- [ ] **TC-24**: Truy cập `/admin` bằng tài khoản thường (Hệ thống phải chặn).
- [ ] **TC-25**: Cấp phát Token cho học viên (Kiểm tra cập nhật Real-time).
- [ ] **TC-26**: **AI Quick Generate**: Thử tạo đề Reading/Writing từ một chủ đề mới.
- [ ] **TC-27**: **Scrape URL**: Dán một link đề thi IELTS thực tế để kiểm tra khả năng bóc tách của AI.

## 📱 8. General & UX (Tổng quát & Trải nghiệm)
- [ ] **TC-28**: Kiểm tra Dark/Light Mode trên tất cả các trang.
- [ ] **TC-29**: Kiểm tra hiển thị trên Mobile (Menu, Form, Bảng điểm).
- [ ] **TC-30**: Kiểm tra tốc độ tải trang (Loading states có mượt mà không?).

---

## 📝 Nhật ký lỗi (Bug Log)
| ID | Tính năng | Mô tả lỗi | Mức độ | Trạng thái |
|---|---|---|---|---|
| B01 | Auth | Redirect sau khi đăng nhập thi thoảng bị chậm | Thấp | ⏳ Đang theo dõi |
| ... | ... | ... | ... | ... |
