# 🚀 IELTS Mastery Platform - Nhật ký Phát triển Dự án

Dưới đây là chi tiết từng bước đã thực hiện trong quá trình xây dựng hệ thống.

---

## 🛠 Phase 1: Foundation & Auth (Nền tảng & Xác thực)
- **Cấu trúc dự án**: Khởi tạo Next.js 16.2.4, Tailwind CSS v4.
- **Thiết kế hệ thống (Design System)**: 
  - Sử dụng font **Plus Jakarta Sans** làm chủ đạo.
  - Áp dụng triết lý thiết kế "Clean & Friendly" với Glassmorphism và màu sắc tươi sáng.
- **Hệ thống xác thực (Supabase Auth)**:
  - Cấu hình Auth Helper cho SSR (Server-side Rendering).
  - Triển khai trang Đăng nhập/Đăng ký với Email/Password.
  - Tích hợp Google OAuth (Đăng nhập bằng một chạm).
- **Hạ tầng Deployment**: Tối ưu hóa file `proxy.ts` (thay thế middleware) và cấu hình Vercel để chạy ổn định với Next.js 16.

---

## 🎨 Phase 2: UI/UX & Responsive Optimization (Tối ưu hóa Giao diện & Trải nghiệm)
- **Premium Aesthetics**:
  - Triển khai hiệu ứng **Glassmorphism** (kính mờ) cho các thẻ Card và Sidebar.
  - Sử dụng hệ màu Sleek Dark Mode và Vivid Light Mode hài hòa.
- **Theme System**: Cài đặt bộ chuyển đổi giao diện **Dark/Light Mode** thông minh, lưu trạng thái vào Cookie/LocalStorage.
- **Typography Optimization**:
  - Tinh chỉnh khoảng cách dòng và kích thước chữ để học viên dễ dàng đọc các đoạn văn dài (chuẩn IELTS Reading).
  - Sử dụng hệ thống font hiện đại giúp giao diện trông cao cấp và thân thiện hơn.
- **Responsive Design**: Tối ưu hóa hiển thị cho mọi thiết bị (Mobile, Tablet, Desktop), đảm bảo trải nghiệm thi không bị gián đoạn.

---

## 🏗 Phase 3.5: Admin & Backend Infrastructure (Quản trị & Hệ cơ sở dữ liệu)
- **Database Schema**: Xây dựng file `SCHEMA.sql` (Profiles, Tests, Submissions, Token Transactions).
- **Phân quyền người dùng (RBAC)**:
  - Thêm cột `role` (admin/student) vào bảng `profiles`.
  - Thiết lập Trigger tự động tạo Profile khi User mới đăng ký.
- **Admin Portal**:
  - Trang đăng nhập Admin riêng biệt tại `/admin/login`.
  - Hàm bảo mật `protectAdmin()` kiểm tra quyền hạn từ Server-side.
- **Quản lý người dùng**: Trang `/admin/users` hỗ trợ cấp phát AI Tokens và theo dõi học viên.
- **Quản lý đề thi**: Trang `/admin/tests` để Admin thêm mới và phân loại bài tập.

---

## 📊 Phase 4: User Dashboard Full Implementation (Bảng điều khiển học viên)
- **Data Integration**: Xây dựng Server Actions `dashboard-actions.ts` để lấy dữ liệu thực từ Supabase.
- **Stats Display**: Hiển thị sống động các chỉ số:
  - Số lượng **AI Tokens** hiện có.
  - Mục tiêu **Target Band**.
  - Xếp hạng học viên theo tuần.
- **Activity Feed**: Hiển thị lịch sử 5 bài làm gần nhất kèm Band điểm đạt được.
- **UI Animation**: Sử dụng Framer Motion để tạo hiệu ứng chuyển động mượt mà khi tải Dashboard.

---

## ✍️ Phase 5: Writing Module Infrastructure (Hạ tầng Module Viết)
- **Writing List**: Xây dựng trang `/writing` liệt kê đề thi Task 1 & Task 2.
- **Professional Editor**:
  - Giao diện **Split-screen** (Đề bài một bên, Editor một bên).
  - Tích hợp bộ đếm giờ (Countdown) và bộ đếm từ (Word count) chính xác.
- **Submission Workflow**: Quy trình nộp bài chuyên nghiệp với màn hình chờ AI và thông báo thành công.

---

## 🤖 Phase 6: AI Integration (Gemini) (Tích hợp Trí tuệ nhân tạo)
- **Gemini Service**: Thiết lập `lib/ai/gemini.ts` kết nối với mô hình Gemini Pro.
- **IELTS Scoring Prompt**: Thiết kế Prompt chuyên dụng để chấm điểm theo 4 tiêu chí: TR, CC, LR, GRA.
- **Submission Action**: Hoàn thiện `writing-actions.ts` điều phối: Auth -> Check Token -> Call AI -> Save Database -> Deduct Token.
- **Token System**: Tự động trừ 1 token sau khi AI trả về kết quả chấm điểm thành công.

---

## 📈 Phase 7: Result Dashboard (Phân tích kết quả chi tiết)
- **Detailed Report**: Trang `/writing/results/[id]` hiển thị báo cáo tổng quát.
- **Criteria Analysis**: Biểu đồ điểm số cho từng tiêu chí IELTS.
- **AI Correction Table**: Bảng phân tích lỗi sai chi tiết:
  - Bản gốc vs Bản sửa lỗi.
  - Giải thích lý do lỗi bằng tiếng Việt.
- **Navigation Flow**: Tự động chuyển hướng từ phòng thi sang trang kết quả sau khi nộp bài.

---

## ⚡ Phase 7.5: Smart Content Ingestion (Nhập liệu Thông minh)
- **AI Test Generator**: 
  - Phát triển tính năng tạo đề thi tự động từ một từ khóa chủ đề.
  - Tích hợp Gemini Pro để soạn thảo nội dung bài đọc Academic Reading (~800 từ) và bộ câu hỏi đi kèm.
- **Web Scraper (Smart Ingestion)**:
  - Triển khai công cụ bóc tách dữ liệu từ URL.
  - Sử dụng quy trình: Fetch HTML -> AI Parsing (Gemini) -> JSON Extraction.
  - Hỗ trợ lấy đề thi từ các website IELTS phổ biến mà không cần nhập liệu thủ công.
- **Admin Automation**: 
  - Giao diện Tabs linh hoạt trong trang Quản trị: "AI Generate" & "Scrape URL".
  - Tự động hóa hoàn toàn quy trình lưu trữ và cập nhật kho đề thi.

---

## 📖 Phase 8: Reading Module (Kỹ năng Đọc)
- **Reading Test UI**: 
  - Giao diện **Split-screen** chuẩn thi máy tính (Bài đọc trái, Câu hỏi phải).
  - Tích hợp bộ đếm giờ (60p) và tính năng Highlight văn bản.
- **Auto-Grading System**:
  - Hệ thống tự động so khớp đáp án của học viên với đáp án chuẩn trong Database.
  - Thuật toán quy đổi số câu đúng sang **IELTS Band Score (4.0 - 9.0)**.
- **Detailed Result Analysis**: 
  - Trang kết quả hiển thị trực quan câu đúng/sai.
  - Cung cấp giải thích chi tiết (Explanation) cho từng câu hỏi để học viên tự học.

---

## 🎧 Phase 9: Listening & Speaking Modules (Kỹ năng Nghe & Nói)
- **Listening Module**: 
  - Tích hợp trình phát âm thanh (Audio Player) tùy chỉnh với Slider điều khiển.
  - Xây dựng giao diện thi Nghe chuyên nghiệp, hỗ trợ đa dạng loại câu hỏi.
  - Kết nối hệ thống tự động chấm điểm dựa trên metadata đề thi.
- **Speaking Module**:
  - Triển khai tính năng ghi âm trực tiếp (Browser MediaRecorder).
  - Giao diện phòng thi Speaking với đồng hồ đếm thời gian và quy trình thi (Start/Stop/Retry/Submit).
  - Thiết kế khung phân tích AI (Sẵn sàng cho việc tích hợp AI phân tích giọng nói).

---

### Phase 9.5: Quality Assurance & Bug Fixing (Đang triển khai)
- [x] **Khắc phục lỗi Build Next.js 16**: Chuyển đổi `middleware.ts` sang `proxy.ts` (chuẩn mới của Next.js 16).
- [x] **Đồng bộ hóa hàm Proxy**: Cập nhật hàm `proxy` và `updateSession` để xử lý session ổn định.
- [x] **Kiểm thử TC-01 (Đăng ký)**: Xác nhận kết nối Supabase thành công (đã nhận phản hồi rate limit từ server).
- [ ] **Kiểm thử TC-02 (Đăng nhập)**: Kiểm tra luồng truy cập Dashboard.
- [ ] **Kiểm thử TC-03 (Dữ liệu Admin)**: Test tính năng Smart Ingestion.
- **Tính ổn định**: Đảm bảo luồng dữ liệu (Data flow) thông suốt từ trang Quản trị đến học viên.

---

## 🎯 Mục tiêu tiếp theo (Next Steps)
- **Phase 10: Subscription & Payment**: Tích hợp cổng thanh toán (Stripe/VNPay/Momo).
- **Phase 11: Real-time AI Speaking**: Sử dụng AI Voice cho phần thi Nói.
