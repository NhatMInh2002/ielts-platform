import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReadingResultClient from "./reading-result-client";

export default async function ReadingResultPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: submission, error } = await supabase
    .from("submissions")
    .select(`
      *,
      test:tests(*)
    `)
    .eq("id", params.id)
    .single();

  if (error || !submission) {
    notFound();
  }

  return <ReadingResultClient submission={submission} />;
}
