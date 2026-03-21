import { supabase } from "./supabase";
import { useTestStore, PathType } from "@/store/useTestStore";
import { AdditionalScores } from "@/lib/additionalScoring";

interface SaveResultParams {
  nickname: string;
  pathway: PathType;
  resultType: string;
  stagePercentages: Record<number, number>;
  answers: Record<number, number>;
  additionalCompleted: boolean;
  additionalAnswers: Record<string, number>;
  additionalScores: AdditionalScores;
  unlocked: boolean;
}

export async function saveResult(params: SaveResultParams) {
  const { error } = await supabase.from("test_results").insert({
    session_id: useTestStore.getState().sessionId,
    nickname: params.nickname || null,
    pathway: params.pathway,
    result_type: params.resultType,
    stage_scores: params.stagePercentages,
    answers: params.answers,
    additional_completed: params.additionalCompleted,
    additional_answers: params.additionalCompleted ? params.additionalAnswers : null,
    additional_scores: params.additionalCompleted ? params.additionalScores : null,
    unlocked: params.unlocked,
  });

  if (error) {
    console.error("Failed to save result:", error.message);
  }
}
