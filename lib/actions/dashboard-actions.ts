"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Lấy dữ liệu tổng quan cho Dashboard học viên
 */
export async function getDashboardData() {
  const supabase = await createClient();
  
  // 1. Lấy thông tin User hiện tại
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 2. Lấy Profile (Tokens, Target Score)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 3. Lấy 5 hoạt động gần nhất
  const { data: recentSubmissions } = await supabase
    .from("submissions")
    .select(`
      *,
      tests (
        title,
        category
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // 4. Tính toán tiến độ từng Module (Giả lập logic tính toán từ kết quả làm bài)
  // Trong thực tế, bạn sẽ đếm số bài đã làm trên tổng số bài có sẵn
  const modulesProgress = {
    listening: 75, // Ví dụ
    reading: 60,
    writing: 45,
    speaking: 55
  };

  return {
    profile,
    recentSubmissions: recentSubmissions || [],
    modulesProgress
  };
}
