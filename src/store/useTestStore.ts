import { create } from "zustand";
import { AdditionalScores, scoreAdditional } from "@/lib/additionalScoring";

export type PathType =
  | "perfectionism"
  | "attachment"
  | "emotion"
  | "initiation";

export type ScreenType =
  | "landing"
  | "nickname"
  | "path"
  | "question"
  | "transition"
  | "additional"
  | "loading"
  | "result"
  | "share"
  | "cta";

interface TestState {
  // Session (in-memory only, no browser storage)
  sessionId: string;
  isHydrated: boolean;

  // Screen navigation
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;

  // Nickname
  nickname: string;
  setNickname: (name: string) => void;

  // Path selection
  selectedPath: PathType | null;
  setSelectedPath: (path: PathType) => void;

  // Question answers (1-indexed, values 1-5)
  answers: Record<number, number>;
  setAnswer: (questionId: number, value: number) => void;
  currentQuestion: number;
  setCurrentQuestion: (q: number) => void;

  // Additional question answers (keyed by string id like "P1", "A2")
  additionalAnswers: Record<string, number>;
  setAdditionalAnswer: (questionId: string, value: number) => void;
  currentAdditionalQuestion: number;
  setCurrentAdditionalQuestion: (q: number) => void;
  additionalCompleted: boolean;
  setAdditionalCompleted: (v: boolean) => void;

  // Computed scores
  getStageScores: () => Record<number, number>;
  getStagePercentages: () => Record<number, number>;
  getResultType: () => string;
  getAdditionalScores: () => AdditionalScores;

  // Unlock state (for result gate)
  unlocked: boolean;
  setUnlocked: (v: boolean) => void;

  // CTA tracking
  emailSubmitted: boolean;
  setEmailSubmitted: (v: boolean) => void;
  journalClicks: number;
  incrementJournalClicks: () => void;
  coachingClicks: number;
  incrementCoachingClicks: () => void;

  // Hydrate from shared URL
  hydrate: (data: {
    answers: Record<number, number>;
    pathway: PathType;
    additionalCompleted: boolean;
    additionalAnswers: Record<string, number>;
    nickname?: string;
    unlocked?: boolean;
  }) => void;

  // Reset
  reset: () => void;
}

const questions = [
  { id: 1, stage: 1, direction: "positive" as const },
  { id: 2, stage: 1, direction: "negative" as const },
  { id: 3, stage: 1, direction: "positive" as const },
  { id: 4, stage: 2, direction: "negative" as const },
  { id: 5, stage: 2, direction: "positive" as const },
  { id: 6, stage: 2, direction: "negative" as const },
  { id: 7, stage: 3, direction: "negative" as const },
  { id: 8, stage: 3, direction: "positive" as const },
  { id: 9, stage: 3, direction: "negative" as const },
  { id: 10, stage: 4, direction: "negative" as const },
  { id: 11, stage: 4, direction: "positive" as const },
  { id: 12, stage: 4, direction: "negative" as const },
  { id: 13, stage: 5, direction: "negative" as const },
  { id: 14, stage: 5, direction: "negative" as const },
  { id: 15, stage: 5, direction: "positive" as const },
];

export const useTestStore = create<TestState>((set, get) => ({
  sessionId: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  isHydrated: false,

  screen: "landing",
  setScreen: (screen) => set({ screen }),

  nickname: "",
  setNickname: (name) => set({ nickname: name }),

  selectedPath: null,
  setSelectedPath: (path) => set({ selectedPath: path }),

  answers: {},
  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
  currentQuestion: 1,
  setCurrentQuestion: (q) => set({ currentQuestion: q }),

  additionalAnswers: {},
  setAdditionalAnswer: (questionId, value) =>
    set((state) => ({
      additionalAnswers: { ...state.additionalAnswers, [questionId]: value },
    })),
  currentAdditionalQuestion: 1,
  setCurrentAdditionalQuestion: (q) => set({ currentAdditionalQuestion: q }),
  additionalCompleted: false,
  setAdditionalCompleted: (v) => set({ additionalCompleted: v }),

  getStageScores: () => {
    const { answers } = get();
    const scores: Record<number, number> = {};
    for (let stage = 1; stage <= 5; stage++) {
      const stageQuestions = questions.filter((q) => q.stage === stage);
      let sum = 0;
      for (const q of stageQuestions) {
        const raw = answers[q.id] || 3;
        sum += q.direction === "negative" ? 6 - raw : raw;
      }
      scores[stage] = sum;
    }
    return scores;
  },

  getStagePercentages: () => {
    const scores = get().getStageScores();
    const percentages: Record<number, number> = {};
    for (let stage = 1; stage <= 5; stage++) {
      percentages[stage] = Math.round(((scores[stage] - 3) / 12) * 100);
    }
    return percentages;
  },

  getResultType: () => {
    const percentages = get().getStagePercentages();
    const entries = Object.entries(percentages).map(([k, v]) => ({
      stage: parseInt(k),
      pct: v,
    }));
    entries.sort((a, b) => a.pct - b.pct);

    const lowest = entries[0];
    const secondLowest = entries[1];

    // Check combo mappings
    const comboMappings = ["1,2", "1,3", "2,3", "2,4", "3,4"];
    if (secondLowest.pct <= 50) {
      const combo = [lowest.stage, secondLowest.stage].sort().join(",");
      if (comboMappings.includes(combo)) {
        return combo;
      }
    }

    return String(lowest.stage);
  },

  getAdditionalScores: () => {
    const { selectedPath, additionalAnswers } = get();
    if (!selectedPath) return {};
    return scoreAdditional(selectedPath, additionalAnswers);
  },

  unlocked: false,
  setUnlocked: (v) => set({ unlocked: v }),

  emailSubmitted: false,
  setEmailSubmitted: (v) => set({ emailSubmitted: v }),
  journalClicks: 0,
  incrementJournalClicks: () =>
    set((state) => ({ journalClicks: state.journalClicks + 1 })),
  coachingClicks: 0,
  incrementCoachingClicks: () =>
    set((state) => ({ coachingClicks: state.coachingClicks + 1 })),

  hydrate: (data) =>
    set({
      isHydrated: true,
      screen: "result",
      nickname: data.nickname || "",
      unlocked: data.unlocked || false,
      selectedPath: data.pathway,
      answers: data.answers,
      currentQuestion: 15,
      additionalAnswers: data.additionalAnswers,
      currentAdditionalQuestion: 6,
      additionalCompleted: data.additionalCompleted,
    }),

  reset: () =>
    set({
      sessionId: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      isHydrated: false,
      screen: "landing",
      nickname: "",
      unlocked: false,
      selectedPath: null,
      answers: {},
      currentQuestion: 1,
      additionalAnswers: {},
      currentAdditionalQuestion: 1,
      additionalCompleted: false,
      emailSubmitted: false,
    }),
}));
