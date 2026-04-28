import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Kiểm tra xem người dùng hiện tại có phải là Admin không.
 * Nếu không phải Admin, sẽ redirect về trang được chỉ định (mặc định là /dashboard)
 */
export async function protectAdmin() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Lấy profile để kiểm tra role
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    // Nếu không phải admin, đá về dashboard của học viên
    return redirect("/dashboard");
  }

  return user;
}

/**
 * Lấy thông tin user và profile hiện tại
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { ...user, profile };
}
