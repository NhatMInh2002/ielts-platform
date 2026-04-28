"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Lấy danh sách toàn bộ người dùng từ bảng profiles
 */
export async function getAllUsers() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data;
}

/**
 * Cập nhật số lượng token cho học viên
 */
export async function updateUserTokens(userId: string, amount: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ ai_tokens: amount })
    .eq("id", userId);

  if (error) {
    throw new Error("Không thể cập nhật token");
  }

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Thêm một đề thi mới vào kho
 */
export async function createTest(testData: {
  title: string;
  category: "listening" | "reading" | "writing" | "speaking";
  difficulty: "easy" | "medium" | "hard";
  content: any;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Chưa đăng nhập");

  const { data, error } = await supabase
    .from("tests")
    .insert([{
      ...testData,
      created_by: user.id
    }])
    .select();

  if (error) {
    console.error("Error creating test:", error);
    throw new Error("Không thể tạo bài test");
  }

  revalidatePath("/admin/tests");
  return data;
}

/**
 * Xóa một đề thi
 */
export async function deleteTest(testId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tests")
    .delete()
    .eq("id", testId);

  if (error) {
    throw new Error("Không thể xóa bài test");
  }

  revalidatePath("/admin/tests");
  return { success: true };
}

import { generateIELTSTest, parseIELTSFromHtml } from "@/lib/ai/gemini";

/**
 * Tạo đề thi tự động bằng AI và lưu vào DB
 */
export async function createTestFromAI(type: "reading" | "writing", topic: string) {
  const supabase = await createClient();

  // 1. Gọi AI để soạn đề
  const aiGeneratedTest = await generateIELTSTest(type, topic);

  // 2. Lưu vào bảng tests
  const { data, error } = await supabase
    .from("tests")
    .insert({
      title: aiGeneratedTest.title,
      content: aiGeneratedTest.content,
      category: type,
      difficulty: aiGeneratedTest.difficulty || "medium",
      metadata: aiGeneratedTest.questions ? { questions: aiGeneratedTest.questions } : {}
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/tests");
  return { success: true, test: data };
}

/**
 * Bóc tách đề thi từ URL và lưu vào DB
 */
export async function scrapeTestFromUrl(type: "reading" | "writing", url: string) {
  const supabase = await createClient();

  try {
    // 1. Fetch nội dung HTML thô từ URL
    const response = await fetch(url);
    const html = await response.text();

    // 2. Gọi AI để bóc tách dữ liệu thông minh
    const scrapedTest = await parseIELTSFromHtml(type, html);

    // 3. Lưu vào DB
    const { data, error } = await supabase
      .from("tests")
      .insert({
        title: scrapedTest.title,
        content: scrapedTest.content,
        category: type,
        difficulty: scrapedTest.difficulty || "medium",
        metadata: scrapedTest.questions ? { questions: scrapedTest.questions } : {}
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/tests");
    return { success: true, test: data };
  } catch (error: any) {
    console.error("Scraping Error:", error);
    throw new Error("Lỗi khi bóc tách URL: " + error.message);
  }
}
