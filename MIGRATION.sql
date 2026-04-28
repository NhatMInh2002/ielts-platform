
-- ==========================================
-- MIGRATION SQL FOR IELTS MASTER PLATFORM
-- Copy và chạy toàn bộ code này trong Supabase SQL Editor
-- ==========================================

-- 0. Kích hoạt tiện ích mở rộng (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng Profiles (Mở rộng từ Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  target_score DECIMAL DEFAULT 7.5,
  ai_tokens INT DEFAULT 500,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Bảng Tests (Quản lý đề thi)
CREATE TABLE IF NOT EXISTS public.tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('listening', 'reading', 'writing', 'speaking')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  content JSONB,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Bảng Submissions (Lưu kết quả làm bài)
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  score DECIMAL,
  band_score DECIMAL,
  feedback TEXT,
  answers JSONB,
  time_spent INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Bảng Transactions (Theo dõi việc sử dụng Token AI)
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Bật RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- 6. Cấu hình Policies cơ bản
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tests (Admin toàn quyền, User chỉ xem)
CREATE POLICY "Tests are viewable by everyone." ON public.tests FOR SELECT USING (true);
CREATE POLICY "Admins can manage tests." ON public.tests USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Trigger tự động tạo Profile khi đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 🛠️ HƯỚNG DẪN TẠO ADMIN ACCOUNT
-- ==========================================
/*
Bước 1: Bạn hãy đăng ký một tài khoản bình thường trên giao diện Web (ví dụ: admin@test.com).
Bước 2: Copy Email của tài khoản đó và chạy lệnh SQL dưới đây để nâng cấp lên Admin:

UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@test.com' -- Thay email của bạn vào đây
);
*/
