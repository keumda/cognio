"use client";

import { useState, useEffect } from "react";
import { AdditionalScores } from "@/lib/additionalScoring";
import { emotionTypes } from "@/lib/emotionTypes";

interface Props {
  scores: AdditionalScores;
}

const typeKeys = ["awareness", "acceptance", "strategy"] as const;
const typeLabels: Record<string, string> = {
  awareness: "감정 인식",
  acceptance: "감정 수용",
  strategy: "감정 대처",
};

export default function EmotionProfile({ scores }: Props) {
  const [openType, setOpenType] = useState<string | null>(
    scores.weakestArea || null
  );
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const scoreMap: Record<string, number> = {
    awareness: scores.awareness || 0,
    acceptance: scores.acceptance || 0,
    strategy: scores.strategy || 0,
  };

  // For emotion: higher score = better. Color: high=green, low=orange
  function getBarColor(score: number): string {
    if (score >= 7) return "#3E67C8";
    if (score >= 5) return "#D6B8E8";
    return "#F36A16";
  }

  return (
    <div>
      <h2 className="text-[20px] font-bold text-[#2A2475] mb-1">
        당신의 감정조절 프로파일
      </h2>
      <p className="text-[14px] text-[#60605d] mb-5">
        감정 인식, 수용, 대처 세 영역을 분석했어요
      </p>

      {/* Bar chart */}
      <div className="flex flex-col gap-3 mb-6">
        {typeKeys.map((key) => {
          const val = scoreMap[key];
          const isWeakest = scores.weakestArea === key;
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-[#2A2475] min-w-[50px] shrink-0">
                  {typeLabels[key]}
                </span>
                <div className="flex-1 h-[28px] bg-[#d0cfe1] rounded-r-lg overflow-hidden">
                  <div
                    className="h-full rounded-r-lg transition-all duration-500 ease-out"
                    style={{
                      width: animated ? `${(val / 10) * 100}%` : "0%",
                      backgroundColor: getBarColor(val),
                    }}
                  />
                </div>
                <span className="text-[13px] font-semibold text-[#2A2475] min-w-[32px] text-right shrink-0">
                  {val}/10
                </span>
              </div>
              {isWeakest && (
                <span className="self-start text-[11px] font-semibold text-white bg-[#F36A16] px-3 py-1 rounded-full ml-[52px]">
                  핵심 어려움
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Type detail cards */}
      <div className="flex flex-col gap-3">
        {typeKeys.map((key) => {
          const data = emotionTypes[key];
          const isWeakest = scores.weakestArea === key;
          const isOpen = openType === key;

          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              style={
                isWeakest
                  ? { border: "2px solid #F36A16" }
                  : { border: "1px solid #d0cfe1" }
              }
            >
              {/* Header */}
              <button
                onClick={() => setOpenType(isOpen ? null : key)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[18px]">{data.emoji}</span>
                  <span className="text-[15px] font-semibold text-[#2A2475] truncate">
                    {data.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isWeakest && (
                    <span className="text-[11px] font-semibold text-white bg-[#F36A16] px-3 py-1 rounded-full">
                      핵심 어려움
                    </span>
                  )}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8c89b4"
                    strokeWidth="2"
                    className="transition-transform duration-300"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? "600px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="border-t border-gray-100 px-4 py-5">
                  {/* Erikson link */}
                  <p className="text-[13px] text-[#60605d] mb-1">
                    {"\uD83D\uDCCE"} Erikson 연결:
                  </p>
                  <p className="text-[14px] text-[#2A2475] font-medium mb-4">
                    {data.eriksonLink}
                  </p>

                  <p className="text-[14px] text-[#564a5d] leading-[1.7] mb-4">
                    {data.description}
                  </p>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Low signals */}
                  <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
                    이런 신호가 있을 수 있어요:
                  </p>
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {data.lowSignals.map((signal) => (
                      <li
                        key={signal}
                        className="text-[14px] text-[#564a5d] leading-[1.5] flex items-start gap-2"
                      >
                        <span className="text-[#F36A16] mt-1.5 text-[6px]">
                          {"\u25CF"}
                        </span>
                        {signal}
                      </li>
                    ))}
                  </ul>

                  {/* Training direction */}
                  <div className="bg-[#f0f3fb] rounded-xl p-4 border-l-2 border-[#3E67C8]">
                    <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
                      {"\uD83D\uDD04"} 훈련 방향:
                    </p>
                    <p className="text-[13px] text-[#374151] leading-[1.7]">
                      {data.trainingDirection}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
