"use client";

import { AdditionalScores } from "@/lib/additionalScoring";
import { attachmentTypes } from "@/lib/attachmentTypes";

interface Props {
  scores: AdditionalScores;
}

const quadrants = [
  { key: "anxious", row: 0, col: 0 },
  { key: "fearful", row: 0, col: 1 },
  { key: "secure", row: 1, col: 0 },
  { key: "dismissive", row: 1, col: 1 },
] as const;

export default function AttachmentMatrix({ scores }: Props) {
  const userType = scores.attachmentType || "secure";
  const typeData = attachmentTypes[userType];

  return (
    <div>
      <h2 className="text-[20px] font-bold text-[#2A2475] mb-1">
        당신의 애착 패턴
      </h2>
      <p className="text-[14px] text-[#60605d] mb-5">
        불안과 회피 두 축으로 분석한 관계 패턴이에요
      </p>

      {/* 2x2 Matrix */}
      <div className="mb-4">
        {/* 회피 축 라벨 (상단, 좌측 라벨 폭+간격과 일치) */}
        <div className="flex justify-between mb-1.5 text-[11px] text-[#8c89b4]" style={{ paddingLeft: 42 }}>
          <span>낮은 회피</span>
          <span>높은 회피</span>
        </div>

        <div className="flex gap-0">
          {/* 불안 축 라벨 (좌측) — 그리드 상단/하단 끝 정렬 */}
          <div className="shrink-0 pr-1.5 text-[11px] text-[#8c89b4] flex flex-col justify-between" style={{ width: 36 }}>
            <span className="text-right leading-tight">높은<br/>불안</span>
            <span className="text-right leading-tight">낮은<br/>불안</span>
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-[2px] rounded-xl overflow-hidden border border-[#d0cfe1]">
              {quadrants.map(({ key }) => {
                const data = attachmentTypes[key];
                const isUser = key === userType;
                return (
                  <div
                    key={key}
                    className={`p-4 flex flex-col items-center justify-center text-center min-h-[100px] ${
                      isUser ? "bg-opacity-15" : "bg-gray-50"
                    }`}
                    style={
                      isUser
                        ? {
                            backgroundColor:
                              key === "secure"
                                ? "rgba(64,145,108,0.1)"
                                : key === "anxious"
                                  ? "rgba(234,179,8,0.1)"
                                  : key === "dismissive"
                                    ? "rgba(59,130,246,0.1)"
                                    : "rgba(147,51,234,0.1)",
                          }
                        : undefined
                    }
                  >
                    <span className="text-[20px] mb-1">
                      {data.emoji}
                      {isUser && " \u25CF"}
                    </span>
                    <span
                      className={`text-[13px] font-semibold ${
                        isUser ? "text-[#2A2475]" : "text-[#60605d]"
                      }`}
                    >
                      {data.name}
                    </span>
                    <span className="text-[11px] text-[#8c89b4]">
                      {data.nameEn}
                    </span>
                  </div>
                );
              })}
            </div>
        </div>
      </div>

      {/* Scores */}
      <div className="flex justify-center gap-6 mb-6">
        <span className="text-[13px] text-[#60605d]">
          불안 점수:{" "}
          <span className="font-semibold text-[#2A2475]">
            {scores.anxiety || 0}/15
          </span>
        </span>
        <span className="text-[13px] text-[#60605d]">
          회피 점수:{" "}
          <span className="font-semibold text-[#2A2475]">
            {scores.avoidanceAxis || 0}/15
          </span>
        </span>
      </div>

      {/* Result type label */}
      <div className="text-center mb-5">
        <span className="text-[20px] mr-2">{typeData.emoji}</span>
        <span className="text-[17px] font-bold text-[#2A2475]">
          {typeData.name}
        </span>
        <span className="text-[13px] text-[#60605d] ml-2">
          ({typeData.nameEn})
        </span>
      </div>

      {/* Detail card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#d0cfe1] p-4">
        {/* Erikson link */}
        <p className="text-[13px] text-[#60605d] mb-1">
          {"\uD83D\uDCCE"} Erikson 연결:
        </p>
        <p className="text-[14px] text-[#2A2475] font-medium mb-4">
          {typeData.eriksonLink}
        </p>

        {/* Description */}
        <p className="text-[14px] text-[#564a5d] leading-[1.7] mb-4">
          {typeData.description}
        </p>

        <div className="h-px bg-gray-100 mb-4" />

        {/* In relationship patterns */}
        <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
          관계에서의 패턴:
        </p>
        <ul className="flex flex-col gap-1.5 mb-4">
          {typeData.inRelationship.map((item) => (
            <li
              key={item}
              className="text-[14px] text-[#564a5d] leading-[1.5] flex items-start gap-2"
            >
              <span className="text-[#3E67C8] mt-1.5 text-[6px]">
                {"\u25CF"}
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="h-px bg-gray-100 mb-4" />

        {/* Growth area */}
        <div className="bg-[#f0f3fb] rounded-xl p-4 border-l-2 border-[#3E67C8]">
          <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
            {"\uD83C\uDF31"} 성장 영역:
          </p>
          <p className="text-[13px] text-[#374151] leading-[1.7]">
            {typeData.growthArea}
          </p>
        </div>
      </div>
    </div>
  );
}
