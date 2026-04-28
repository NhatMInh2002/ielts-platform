import WritingTestClient from "./writing-test-client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function WritingTestPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Lấy chi tiết đề thi từ database (Tạm thời mock nếu chưa có data)
  const { data: test } = await supabase
    .from("tests")
    .select("*")
    .eq("id", params.id)
    .single();

  // Mock data để demo nếu DB chưa có
  const mockTest = {
    id: params.id,
    title: "Task 2: The Impact of Social Media on Modern Communication",
    category: "writing",
    type: "Task 2",
    content: `Many people believe that social media has had a negative impact on the way people communicate with each other. 
    
    To what extent do you agree or disagree with this statement?
    
    Give reasons for your answer and include any relevant examples from your own knowledge or experience.
    
    Write at least 250 words.`,
    time_limit: 40 // minutes
  };

  const displayTest = test || mockTest;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 flex flex-col">
      <WritingTestClient test={displayTest} />
    </div>
  );
}
