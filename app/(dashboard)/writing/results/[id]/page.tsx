import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WritingResultClient from "./writing-result-client";

export default async function WritingResultPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Lấy chi tiết bài nộp và kết quả AI
  const { data: submission } = await supabase
    .from("submissions")
    .select(`
      *,
      tests (
        title,
        content,
        type
      )
    `)
    .eq("id", params.id)
    .single();

  if (!submission) {
    notFound();
  }

  return (
    <div className="pb-12">
      <WritingResultClient submission={submission} />
    </div>
  );
}
