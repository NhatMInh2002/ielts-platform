"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitReadingTest(testId: string, studentAnswers: Record<number, string>) {
  const supabase = await createClient();
  
  // 1. Kiểm tra xác thực
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Bạn cần đăng nhập để nộp bài");

  // 2. Lấy dữ liệu đề thi để so sánh đáp án
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("*")
    .eq("id", testId)
    .single();

  if (testError || !test) throw new Error("Không tìm thấy đề thi");

  const questions = test.metadata?.questions || [];
  let correctCount = 0;
  const detailedResults: any[] = [];

  // 3. Chấm điểm tự động
  questions.forEach((q: any) => {
    const studentAnswer = studentAnswers[q.id];
    const isCorrect = studentAnswer?.trim().toLowerCase() === q.answer?.trim().toLowerCase();
    
    if (isCorrect) correctCount++;
    
    detailedResults.push({
      question_id: q.id,
      student_answer: studentAnswer,
      correct_answer: q.answer,
      is_correct: isCorrect,
      explanation: q.explanation
    });
  });

  // 4. Quy đổi Band Score (Ước lượng cơ bản)
  // Trong IELTS Reading Academic: 30/40 là 7.0. Ở đây chúng ta tính tỉ lệ.
  const percentage = (correctCount / questions.length) * 100;
  let bandScore = 0;
  if (percentage >= 90) bandScore = 9.0;
  else if (percentage >= 85) bandScore = 8.5;
  else if (percentage >= 80) bandScore = 8.0;
  else if (percentage >= 75) bandScore = 7.5;
  else if (percentage >= 70) bandScore = 7.0;
  else if (percentage >= 60) bandScore = 6.0;
  else if (percentage >= 50) bandScore = 5.0;
  else bandScore = 4.0;

  // 5. Lưu kết quả vào bảng submissions
  const { data: submission, error: subError } = await supabase
    .from("submissions")
    .insert([{
      user_id: user.id,
      test_id: testId,
      content: JSON.stringify(studentAnswers), // Lưu bài làm
      score: bandScore,
      feedback: {
        correct_count: correctCount,
        total_questions: questions.length,
        detailed_results: detailedResults
      },
      status: "completed"
    }])
    .select()
    .single();

  if (subError) throw subError;

  revalidatePath("/dashboard");
  // Chuyển hướng tới trang kết quả (chúng ta sẽ dùng chung format hoặc tạo mới)
  redirect(`/reading/results/${submission.id}`);
}
