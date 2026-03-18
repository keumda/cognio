"use client";

import { useState, useEffect, useCallback } from "react";
import { stageAnalysisData } from "@/lib/stageAnalysis";

interface StageAccordionProps {
  stageScores: number[]; // [72, 38, 65, 41, 78] — 5 stage % scores (index 0 = stage 1)
  limit?: number; // max number of cards to show (default: all)
}

function getLevel(score: number): "high" | "mid" | "low" {
  if (score >= 70) return "high";
  if (score >= 50) return "mid";
  return "low";
}

function getBarColor(score: number): string {
  if (score >= 70) return "#3E67C8";
  if (score >= 50) return "#D6B8E8";
  return "#F36A16";
}

function getLevelIcon(level: "high" | "mid" | "low"): string {
  if (level === "high") return "\u2728";
  if (level === "mid") return "\uD83D\uDD38";
  return "\uD83D\uDD36";
}

function getSortedStages(scores: number[]) {
  return scores
    .map((score, i) => ({ stage: i + 1, score }))
    .sort((a, b) => a.score - b.score);
}

function computeDefaultOpen(sorted: { stage: number; score: number }[]): Set<number> {
  // Open the lowest 2
  const open = new Set<number>();
  open.add(sorted[0].stage);
  if (sorted.length > 1) open.add(sorted[1].stage);
  return open;
}

export default function StageAccordion({ stageScores, limit }: StageAccordionProps) {
  const sorted = getSortedStages(stageScores);
  const displayed = limit ? sorted.slice(0, limit) : sorted;
  const [openStages, setOpenStages] = useState<Set<number>>(() =>
    computeDefaultOpen(sorted)
  );
  const [animated, setAnimated] = useState(false);

  // Trigger bar animation after mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const toggleStage = useCallback(
    (stage: number) => {
      setOpenStages((prev) => {
        const next = new Set(prev);
        if (next.has(stage)) {
          next.delete(stage);
        } else {
          next.add(stage);
          // Track in localStorage
          try {
            const existing: number[] = JSON.parse(
              localStorage.getItem("stage_accordion_opened") || "[]"
            );
            if (!existing.includes(stage)) {
              existing.push(stage);
              localStorage.setItem(
                "stage_accordion_opened",
                JSON.stringify(existing)
              );
            }
          } catch {
            // ignore
          }
        }
        return next;
      });
    },
    []
  );

  return (
    <div className="mb-8">
      {/* Section header */}
      <h2 className="text-[20px] font-bold text-[#2A2475] mb-1">
        나의 단계별 분석
      </h2>
      <p className="text-[14px] text-[#60605d] mb-5">
        각 단계를 탭하면 자세한 분석을 볼 수 있어요
      </p>

      {/* Accordion cards — sorted by score ascending */}
      <div className="flex flex-col gap-3">
        {displayed.map(({ stage, score }) => {
          const data = stageAnalysisData[stage];
          const isOpen = openStages.has(stage);
          const level = getLevel(score);
          const barColor = getBarColor(score);
          const interpretation = data[level];
          const levelIcon = getLevelIcon(level);

          return (
            <div
              key={stage}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Collapsed header — always visible */}
              <button
                onClick={() => toggleStage(stage)}
                className="w-full flex items-center gap-2 px-3 py-3 text-left"
              >
                {/* Emoji + name */}
                <span className="text-[16px] shrink-0">{data.emoji}</span>
                <span className="text-[14px] font-semibold text-[#2A2475] min-w-[62px] shrink-0">
                  {data.name}
                </span>

                {/* Progress bar */}
                <div className="flex-1 h-[8px] bg-[#d0cfe1] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: animated ? `${score}%` : "0%",
                      backgroundColor: barColor,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>

                {/* Percentage */}
                <span
                  className="text-[14px] font-semibold min-w-[38px] text-right"
                  style={{ color: barColor }}
                >
                  {score}%
                </span>

                {/* Arrow */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8c89b4"
                  strokeWidth="2"
                  className="flex-shrink-0 transition-transform duration-300"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Expanded content */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? "1200px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="border-t border-gray-100 px-4 py-5">
                  {/* Period */}
                  <p className="text-[13px] text-[#60605d] mb-3">
                    형성 시기: {data.period}
                  </p>

                  {/* Core question */}
                  <p className="text-[15px] italic text-[#374151] mb-4 leading-[1.6]">
                    &ldquo;{data.coreQuestion}&rdquo;
                  </p>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Interpretation */}
                  <h3 className="text-[15px] font-semibold text-[#2A2475] mb-2 leading-[1.5]">
                    {levelIcon} {interpretation.title}
                  </h3>
                  <p className="text-[14px] text-[#564a5d] leading-[1.7] mb-4">
                    {interpretation.description}
                  </p>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Related symptoms */}
                  <p className="text-[13px] text-[#60605d] mb-2">
                    관련될 수 있는 어려움:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {data.relatedSymptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="bg-gray-100 text-[#564a5d] text-[12px] px-3 py-1 rounded-full"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>

                  {/* Rewrite prompt — only show for low scores */}
                  {level === "low" && (
                    <div className="bg-[#f0f3fb] rounded-xl p-4 border-l-2 border-[#3E67C8]">
                      <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
                        {"\uD83D\uDCA1"} 마음 들여다보기
                      </p>
                      <p className="text-[13px] italic text-[#374151] leading-[1.7]">
                        &ldquo;{data.rewritePrompt}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
