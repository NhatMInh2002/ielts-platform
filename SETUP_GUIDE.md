# IELTS 7.5 Platform - Local Development Setup Guide

## 📋 Checklist trước khi bắt đầu

Đảm bảo máy bạn đã cài:
- [ ] Node.js 18+ ([nodejs.org](https://nodejs.org))
- [ ] npm hoặc yarn
- [ ] Git
- [ ] VS Code (khuyến nghị)
- [ ] PostgreSQL (hoặc sẽ dùng Supabase cloud - khuyến nghị)

---

## 🚀 BƯỚC 1: Khởi tạo Next.js Project

### 1.1 Tạo project mới

```bash
# Mở terminal và chạy:
npx create-next-app@latest ielts-platform

# Khi được hỏi, chọn các options sau:
✅ Would you like to use TypeScript? → Yes
✅ Would you like to use ESLint? → Yes
✅ Would you like to use Tailwind CSS? → Yes
✅ Would you like to use `src/` directory? → No
✅ Would you like to use App Router? → Yes (recommended)
✅ Would you like to customize the default import alias? → No
```

### 1.2 Di chuyển vào project

```bash
cd ielts-platform
```

---

## 📦 BƯỚC 2: Cài đặt Dependencies

### 2.1 Core dependencies

```bash
npm install @supabase/supabase-js
npm install @google/generative-ai
npm install zustand
npm install @tanstack/react-query
npm install next-auth
npm install bcryptjs
npm install zod
```

### 2.2 UI Components (Shadcn/ui)

```bash
# Khởi tạo Shadcn
npx shadcn-ui@latest init

# Khi được hỏi:
✅ Which style would you like to use? → Default
✅ Which color would you like to use as base color? → Slate
✅ Would you like to use CSS variables for colors? → Yes

# Cài các components cần thiết
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
```

### 2.3 Development dependencies

```bash
npm install -D @types/bcryptjs
npm install -D prisma
npm install @prisma/client
```

---

## 🗄️ BƯỚC 3: Setup Database (Supabase)

### 3.1 Tạo Supabase project

1. Truy cập [supabase.com](https://supabase.com)
2. Sign up / Login
3. Click "New Project"
4. Điền thông tin:
   - Name: `ielts-platform`
   - Database Password: (tạo mật khẩu mạnh, LƯU LẠI)
   - Region: `Southeast Asia (Singapore)` (gần Việt Nam nhất)
5. Click "Create new project" (chờ ~2 phút)

### 3.2 Lấy connection strings

Sau khi project được tạo:
1. Vào `Settings` → `Database`
2. Copy các thông tin sau:
   - `Project URL` (API URL)
   - `Project API Key` (anon/public key)
   - `Connection string` (để cho Prisma)

### 3.3 Tạo file `.env.local`

```bash
# Trong thư mục root của project, tạo file .env.local
touch .env.local
```

Mở `.env.local` và thêm:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-connection-string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Để generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3.4 Setup Prisma

```bash
# Khởi tạo Prisma
npx prisma init
```

---

## 🏗️ BƯỚC 4: Tạo Database Schema

### 4.1 Cập nhật `prisma/schema.prisma`

File này đã được tạo sau bước 3.4. Tôi sẽ tạo schema chi tiết ở file riêng.

### 4.2 Chạy migration

```bash
# Tạo tables trong database
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

---

## 📁 BƯỚC 5: Tạo Project Structure

### 5.1 Cấu trúc thư mục

```
ielts-platform/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected routes group
│   │   ├── dashboard/
│   │   ├── listening/
│   │   ├── reading/
│   │   ├── writing/
│   │   ├── speaking/
│   │   └── progress/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── tests/
│   │   │   ├── listening/
│   │   │   ├── reading/
│   │   │   ├── writing/
│   │   │   └── speaking/
│   │   └── feedback/
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # Shadcn components
│   ├── listening/
│   ├── reading/
│   ├── writing/
│   ├── speaking/
│   ├── shared/                   # Shared components
│   └── layout/
├── lib/                          # Utilities
│   ├── supabase.ts
│   ├── gemini.ts
│   ├── prisma.ts
│   └── utils.ts
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useTest.ts
│   └── useProgress.ts
├── types/                        # TypeScript types
│   ├── test.ts
│   ├── user.ts
│   └── feedback.ts
├── store/                        # Zustand stores
│   ├── authStore.ts
│   └── testStore.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/                       # Static files
│   ├── audio/                    # Listening test audio
│   └── images/
├── .env.local                    # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 5.2 Tạo folders

```bash
# Tạo cấu trúc thư mục
mkdir -p app/\(auth\)/login app/\(auth\)/register
mkdir -p app/\(dashboard\)/dashboard app/\(dashboard\)/listening
mkdir -p app/\(dashboard\)/reading app/\(dashboard\)/writing
mkdir -p app/\(dashboard\)/speaking app/\(dashboard\)/progress
mkdir -p app/api/auth app/api/tests/listening app/api/tests/reading
mkdir -p app/api/tests/writing app/api/tests/speaking app/api/feedback
mkdir -p components/ui components/listening components/reading
mkdir -p components/writing components/speaking components/shared components/layout
mkdir -p lib hooks types store
mkdir -p public/audio public/images
```

---

## ⚙️ BƯỚC 6: Cấu hình cơ bản

### 6.1 Tạo `lib/supabase.ts`

(File config sẽ được tạo riêng)

### 6.2 Tạo `lib/gemini.ts`

(File config sẽ được tạo riêng)

### 6.3 Tạo `lib/prisma.ts`

(File config sẽ được tạo riêng)

---

## 🎨 BƯỚC 7: Setup Tailwind Colors (IELTS Theme)

### 7.1 Cập nhật `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // IELTS Brand Colors
        primary: {
          DEFAULT: '#2563eb', // Blue
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 🔑 BƯỚC 8: Setup Authentication (NextAuth)

### 8.1 Tạo `app/api/auth/[...nextauth]/route.ts`

(File sẽ được tạo riêng)

---

## 🧪 BƯỚC 9: Test Setup

### 9.1 Chạy development server

```bash
npm run dev
```

Mở browser: `http://localhost:3000`

### 9.2 Test Prisma connection

```bash
npx prisma studio
```

Mở browser: `http://localhost:5555` (Prisma admin UI)

### 9.3 Test API endpoints

```bash
# Test health check (tạo endpoint này sau)
curl http://localhost:3000/api/health
```

---

## 📚 BƯỚC 10: Setup Git & Version Control

### 10.1 Tạo `.gitignore`

```bash
# Next.js
.next/
out/
build/
dist/

# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment
.env
.env.local
.env*.local

# Database
prisma/*.db
prisma/*.db-journal

# Testing
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
```

### 10.2 Initialize Git

```bash
git init
git add .
git commit -m "Initial commit: Setup Next.js IELTS platform"
```

### 10.3 Connect to GitHub (optional)

```bash
# Tạo repo mới trên GitHub, sau đó:
git remote add origin https://github.com/your-username/ielts-platform.git
git branch -M main
git push -u origin main
```

---

## 🔐 BƯỚC 11: Lấy Google Gemini API Key

### 11.1 Tạo API key

1. Truy cập [Google AI Studio](https://aistudio.google.com)
2. Login / Sign up
3. Vào `API Keys`
4. Click `Create Key`
5. Đặt tên: `ielts-platform-dev`
6. Copy API key (chỉ hiển thị 1 lần!)
7. Paste vào `.env.local` → `GEMINI_API_KEY=AIzaSy...`

### 11.2 Test API connection

```bash
# Tạo file test nhỏ
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
model.generateContent('Hello!').then(r => console.log(r.response.text()));
"
```

---

## 📊 BƯỚC 12: Setup Analytics & Monitoring (Optional)

### 12.1 Posthog (Product Analytics)

```bash
npm install posthog-js
```

1. Tạo account tại [posthog.com](https://posthog.com)
2. Lấy API key và thêm vào `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 12.2 Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## ✅ BƯỚC 13: Verification Checklist

Trước khi code, đảm bảo:

- [ ] `npm run dev` chạy thành công
- [ ] `http://localhost:3000` hiển thị Next.js welcome page
- [ ] `.env.local` có đầy đủ keys
- [ ] `npx prisma studio` mở được
- [ ] Database connection thành công
- [ ] Git initialized và committed
- [ ] Folder structure đã tạo
- [ ] Dependencies đã cài đủ

---

## 🚀 TIẾP THEO: Bắt đầu Code!

Sau khi setup xong, chúng ta sẽ:

1. ✅ Tạo database schema chi tiết
2. ✅ Build authentication system
3. ✅ Tạo landing page
4. ✅ Build Listening module (MVP đầu tiên)
5. ✅ Integrate Gemini API cho feedback

---

## 🆘 Troubleshooting

### Lỗi: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js --save
```

### Lỗi: Prisma migration failed
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Lỗi: Port 3000 already in use
```bash
# Tìm và kill process
lsof -ti:3000 | xargs kill -9

# Hoặc chạy trên port khác
npm run dev -- -p 3001
```

### Lỗi: Module not found after install
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình setup:
1. Check terminal logs kỹ
2. Google error message
3. Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
4. Ask AI (me!) 😊

---

**Setup hoàn tất! Sẵn sàng code! 🎉**