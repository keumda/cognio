"use client";

import { useState, useEffect } from "react";
import { AdditionalScores } from "@/lib/additionalScoring";
import { perfectionismTypes } from "@/lib/perfectionismTypes";

interface Props {
  scores: AdditionalScores;
}

const typeKeys = ["shame", "avoidance", "proving"] as const;
const typeLabels: Record<string, string> = {
  shame: "수치심형",
  avoidance: "회피형",
  proving: "증명형",
};

export default function PerfectionismProfile({ scores }: Props) {
  const [openType, setOpenType] = useState<string | null>(
    scores.primaryType || null
  );
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const scoreMap: Record<string, number> = {
    shame: scores.shame || 0,
    avoidance: scores.avoidance || 0,
    proving: scores.proving || 0,
  };

  return (
    <div>
      <h2 className="text-[20px] font-bold text-[#2A2475] mb-1">
        당신의 완벽주의 프로파일
      </h2>
      <p className="text-[14px] text-[#60605d] mb-5">
        3가지 유형 중 당신의 패턴을 확인해보세요
      </p>

      {/* Bar chart */}
      <div className="flex flex-col gap-3 mb-6">
        {typeKeys.map((key) => {
          const val = scoreMap[key];
          const isPrimary = scores.primaryType === key;
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
                      backgroundColor: isPrimary ? "#3E67C8" : "#D6B8E8",
                    }}
                  />
                </div>
                <span className="text-[13px] font-semibold text-[#2A2475] min-w-[32px] text-right shrink-0">
                  {val}/10
                </span>
              </div>
              {isPrimary && (
                <span className="self-start text-[11px] font-semibold text-white bg-[#46C5B8] px-3 py-1 rounded-full ml-[52px]">
                  주요 유형
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Type detail cards */}
      <div className="flex flex-col gap-3">
        {typeKeys.map((key) => {
          const data = perfectionismTypes[key];
          const isPrimary = scores.primaryType === key;
          const isOpen = openType === key;

          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              style={
                isPrimary
                  ? { border: "2px solid #46C5B8" }
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
                  {isPrimary && (
                    <span className="text-[11px] font-semibold text-white bg-[#46C5B8] px-3 py-1 rounded-full">
                      당신의 주요 유형
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

              {/* Tagline */}
              <div className="px-4 pb-2 -mt-1">
                <p className="text-[13px] italic text-[#60605d]">
                  {data.tagline}
                </p>
              </div>

              {/* Expanded content */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? "800px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="border-t border-gray-100 px-4 py-5">
                  {/* Erikson connection */}
                  <p className="text-[13px] text-[#60605d] mb-1">
                    {"\uD83D\uDCCE"} Erikson 연결:
                  </p>
                  <p className="text-[14px] text-[#2A2475] font-medium mb-4">
                    {data.eriksonLink}
                  </p>

                  {/* Description */}
                  <p className="text-[14px] text-[#564a5d] leading-[1.7] mb-4">
                    {data.description}
                  </p>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Core beliefs */}
                  <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
                    {"\uD83D\uDCAD"} 핵심 믿음:
                  </p>
                  <div className="flex flex-col gap-1.5 mb-4">
                    {data.coreBeliefs.map((belief) => (
                      <p
                        key={belief}
                        className="text-[14px] italic text-[#374151] leading-[1.6]"
                      >
                        &ldquo;{belief}&rdquo;
                      </p>
                    ))}
                  </div>

                  <div className="h-px bg-gray-100 mb-4" />

                  {/* Daily patterns */}
                  <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
                    {"\uD83D\uDCCB"} 일상 패턴:
                  </p>
                  <div className="flex flex-col gap-1.5 mb-4">
                    {data.dailyPatterns.map((pattern) => (
                      <div
                        key={pattern}
                        className="flex items-start gap-2"
                      >
                        <span className="text-[12px] mt-0.5 flex-shrink-0">
                          {"\u25B8"}
                        </span>
                        <span className="text-[14px] text-[#564a5d] leading-[1.5]">
                          {pattern}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rewrite direction */}
                  <div className="bg-[#f0f3fb] rounded-xl p-4 border-l-2 border-[#3E67C8]">
                    <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
                      {"\uD83D\uDD04"} COGNIO 방향:
                    </p>
                    <p className="text-[13px] text-[#374151] leading-[1.7]">
                      {data.rewriteDirection}
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
