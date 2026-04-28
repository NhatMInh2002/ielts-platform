"use server";

import { createClient } from "@/lib/supabase/server";
import { scoreWritingTask } from "@/lib/ai/gemini";
import { revalidatePath } from "next/cache";

export async function submitWritingTest(testId: string, essay: string) {
  const supabase = await createClient();
  
  // 1. Kiểm tra Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Vui lòng đăng nhập để nộp bài.");

  // 2. Kiểm tra Token của người dùng
  const { data: profile } = await supabase
    .from("profiles")
    .select("ai_tokens")
    .eq("id", user.id)
    .single();

  if (!profile || profile.ai_tokens < 1) {
    throw new Error("Bạn không đủ AI Tokens để chấm điểm bài viết này. Vui lòng nạp thêm.");
  }

  // 3. Lấy thông tin đề thi
  const { data: test } = await supabase
    .from("tests")
    .select("title, content")
    .eq("id", testId)
    .single();

  const testTitle = test?.title || "IELTS Writing Task";
  const question = test?.content || "No question content provided.";

  // 4. Gọi Gemini AI để chấm điểm
  const aiResult = await scoreWritingTask(testTitle, question, essay);

  // 5. Lưu vào bảng submissions
  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .insert({
      user_id: user.id,
      test_id: testId,
      content: essay,
      score: aiResult.overall_band,
      feedback: aiResult,
      status: "completed"
    })
    .select()
    .single();

  if (submissionError) {
    console.error("Submission Save Error:", submissionError);
    throw new Error("Không thể lưu bài làm. Tuy nhiên AI đã chấm xong.");
  }

  // 6. Trừ token người dùng
  await supabase
    .from("profiles")
    .update({ ai_tokens: profile.ai_tokens - 1 })
    .eq("id", user.id);

  // 7. Ghi nhật ký giao dịch token
  await supabase
    .from("token_transactions")
    .insert({
      user_id: user.id,
      amount: -1,
      type: "usage",
      description: `Chấm điểm bài viết: ${testTitle}`
    });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");

  return {
    success: true,
    submissionId: submission.id,
    result: aiResult
  };
}
