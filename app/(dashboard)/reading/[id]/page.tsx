import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReadingTestClient from "./reading-test-client";

export default async function ReadingTestPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: test, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !test) {
    notFound();
  }

  return <ReadingTestClient test={test} />;
}
