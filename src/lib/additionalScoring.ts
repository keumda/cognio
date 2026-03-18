import { additionalQuestions } from "./additionalQuestions";

export interface AdditionalScores {
  // perfectionism
  shame?: number;
  avoidance?: number;
  proving?: number;
  primaryType?: string;

  // attachment
  anxiety?: number;
  avoidanceAxis?: number;
  attachmentType?: string;

  // emotion
  awareness?: number;
  acceptance?: number;
  strategy?: number;
  weakestArea?: string;

  // initiation
  fear?: number;
  energy?: number;
  focus?: number;
  primaryChallenge?: string;
}

function getScore(
  answers: Record<string, number>,
  questionId: string,
  direction: "positive" | "negative"
): number {
  const raw = answers[questionId] || 3;
  return direction === "negative" ? raw : 6 - raw;
}

function getPositiveScore(
  answers: Record<string, number>,
  questionId: string,
  direction: "positive" | "negative"
): number {
  const raw = answers[questionId] || 3;
  return direction === "positive" ? raw : 6 - raw;
}

export function scorePerfectionism(
  answers: Record<string, number>
): AdditionalScores {
  const qs = additionalQuestions.perfectionism;
  // All negative, so raw value = severity (higher = more problematic)
  const shame =
    getScore(answers, "P1", qs[0].direction) +
    getScore(answers, "P4", qs[3].direction);
  const avoidance =
    getScore(answers, "P2", qs[1].direction) +
    getScore(answers, "P5", qs[4].direction);
  const proving =
    getScore(answers, "P3", qs[2].direction) +
    getScore(answers, "P6", qs[5].direction);

  // Determine primary type (highest = most problematic)
  const scores = { shame, avoidance, proving };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  // Tie-breaking: shame > avoidance > proving
  const priority = ["shame", "avoidance", "proving"];
  let primaryType = sorted[0][0];
  if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) {
    const tied = sorted.filter((s) => s[1] === sorted[0][1]).map((s) => s[0]);
    primaryType = priority.find((p) => tied.includes(p)) || tied[0];
  }

  return { shame, avoidance, proving, primaryType };
}

export function scoreAttachment(
  answers: Record<string, number>
): AdditionalScores {
  // anxiety axis: A1(negative, raw), A3(negative, raw), A5(negative, raw)
  const anxiety =
    (answers["A1"] || 3) + (answers["A3"] || 3) + (answers["A5"] || 3);

  // avoidance axis: A2(positive, reverse), A4(negative, raw), A6(negative, raw)
  const avoidanceAxis =
    (6 - (answers["A2"] || 3)) + (answers["A4"] || 3) + (answers["A6"] || 3);

  // Classification based on midpoint of 9
  let attachmentType: string;
  if (anxiety <= 9 && avoidanceAxis <= 9) {
    attachmentType = "secure";
  } else if (anxiety > 9 && avoidanceAxis <= 9) {
    attachmentType = "anxious";
  } else if (anxiety <= 9 && avoidanceAxis > 9) {
    attachmentType = "dismissive";
  } else {
    attachmentType = "fearful";
  }

  return { anxiety, avoidanceAxis, attachmentType };
}

export function scoreEmotion(
  answers: Record<string, number>
): AdditionalScores {
  const qs = additionalQuestions.emotion;
  // Higher score = better developed
  const awareness =
    getPositiveScore(answers, "E1", qs[0].direction) +
    getPositiveScore(answers, "E4", qs[3].direction);
  const acceptance =
    getPositiveScore(answers, "E2", qs[1].direction) +
    getPositiveScore(answers, "E5", qs[4].direction);
  const strategy =
    getPositiveScore(answers, "E3", qs[2].direction) +
    getPositiveScore(answers, "E6", qs[5].direction);

  // Weakest area = lowest score
  const scores = { awareness, acceptance, strategy };
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const weakestArea = sorted[0][0];

  return { awareness, acceptance, strategy, weakestArea };
}

export function scoreInitiation(
  answers: Record<string, number>
): AdditionalScores {
  // All negative, raw value = severity
  const fear = (answers["I1"] || 3) + (answers["I4"] || 3);
  const energy = (answers["I2"] || 3) + (answers["I5"] || 3);
  const focus = (answers["I3"] || 3) + (answers["I6"] || 3);

  // Highest = most problematic
  const scores = { fear, energy, focus };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryChallenge = sorted[0][0];

  return { fear, energy, focus, primaryChallenge };
}

export function scoreAdditional(
  pathway: string,
  answers: Record<string, number>
): AdditionalScores {
  switch (pathway) {
    case "perfectionism":
      return scorePerfectionism(answers);
    case "attachment":
      return scoreAttachment(answers);
    case "emotion":
      return scoreEmotion(answers);
    case "initiation":
      return scoreInitiation(answers);
    default:
      return {};
  }
}
