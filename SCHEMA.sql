-- SCHEMA CHO IELTS MASTER PLATFORM
-- Chạy đoạn mã này trong Supabase SQL Editor

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

-- Bật Row Level Security cho Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admin có thể làm mọi thứ, User chỉ có thể xem/sửa profile của chính mình
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Bảng Tests (Quản lý đề thi)
CREATE TABLE IF NOT EXISTS public.tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('listening', 'reading', 'writing', 'speaking')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  content JSONB, -- Lưu trữ cấu trúc câu hỏi, script, bài đọc...
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
  answers JSONB, -- Lưu câu trả lời của user
  time_spent INT, -- Tính bằng giây
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Bảng Transactions (Theo dõi việc sử dụng Token AI)
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT, -- Có thể âm (chi tiêu) hoặc dương (nạp thêm)
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- TRIGGER: Tự động tạo profile khi có user mới đăng ký qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
