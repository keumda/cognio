import { supabase } from "./supabase";

interface SaveEmailParams {
  email: string;
  source: string;
  pathway?: string;
  resultType?: string;
  additionalCompleted?: boolean;
}

export async function saveEmail(params: SaveEmailParams) {
  const { error } = await supabase.from("emails").insert({
    email: params.email,
    source: params.source,
    pathway: params.pathway || null,
    result_type: params.resultType || null,
    additional_completed: params.additionalCompleted ?? false,
  });

  // 중복 이메일은 unique constraint로 무시 (23505 = unique_violation)
  if (error && error.code !== "23505") {
    console.error("Failed to save email:", error.message);
  }
}
