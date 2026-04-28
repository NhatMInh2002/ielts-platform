import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SpeakingTestClient from "./speaking-test-client";

export default async function SpeakingTestPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: test, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !test) {
    notFound();
  }

  return <SpeakingTestClient test={test} />;
}
