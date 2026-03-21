import { supabase } from "./supabase";
import { getSessionId } from "./session";

interface SaveEmailParams {
  email: string;
  source: string;
  pathway?: string;
  resultType?: string;
  additionalCompleted?: boolean;
}

export async function saveEmail(params: SaveEmailParams) {
  const { error } = await supabase.from("emails").insert({
    session_id: getSessionId(),
    email: params.email,
    source: params.source,
    pathway: params.pathway || null,
    result_type: params.resultType || null,
    additional_completed: params.additionalCompleted ?? false,
  });

  if (error) {
    console.error("Failed to save email:", error.message);
  }
}
