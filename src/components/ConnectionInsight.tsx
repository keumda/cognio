"use client";

import { useState, useCallback } from "react";
import { connectionInsights } from "@/lib/connectionInsights";
import { stageAnalysisData } from "@/lib/stageAnalysis";
import { courses } from "@/lib/recommendations";
import { track } from "@/lib/tracking";

interface Props {
  stageScores: number[]; // [72, 38, 65, 41, 78]
  userEmail?: string;
}

function getBarColor(score: number): string {
  if (score >= 70) return "#3E67C8";
  if (score >= 50) return "#D6B8E8";
  return "#F36A16";
}

export default function ConnectionInsight({ stageScores, userEmail }: Props) {
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const lowStages = stageScores
    .map((s, i) => ({ stage: i + 1, score: s }))
    .filter((x) => x.score < 50)
    .sort((a, b) => a.score - b.score);

  if (lowStages.length < 2) return null;

  const lowest1 = lowStages[0];
  const lowest2 = lowStages[1];
  const comboKey = [lowest1.stage, lowest2.stage].sort().join(",");
  const insight = connectionInsights[comboKey];

  if (!insight) return null;

  const stage1Data = stageAnalysisData[lowest1.stage];
  const stage2Data = stageAnalysisData[lowest2.stage];

  // 추천 코스 매칭
  const recommendedCourses = insight.courseIds
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean) as typeof courses;

  const handleNotify = (courseId: string) => {
    track({
      event: "course_notify",
      source: "connection_insight",
      programId: courseId,
      email: userEmail || "",
    });
    setNotified((prev) => new Set(prev).add(courseId));
  };

  return (
    <div>
      <h2 className="text-[20px] font-bold text-[#2A2475] mb-1">
        {"\uD83D\uDD17"} 당신의 패턴은 이렇게 연결되어 있어요
      </h2>
      <p className="text-[14px] text-[#60605d] mb-5">
        낮은 단계들이 서로 영향을 주고 있어요
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-[#d0cfe1] p-4">
        {/* Connection diagram */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div
            className="rounded-xl px-3 py-2.5 text-center flex-1 max-w-[110px]"
            style={{
              border: `2px solid ${getBarColor(lowest1.score)}`,
              backgroundColor: `${getBarColor(lowest1.score)}10`,
            }}
          >
            <div className="text-[20px] mb-1">{stage1Data.emoji}</div>
            <div className="text-[13px] font-semibold text-[#2A2475]">{lowest1.stage}단계</div>
            <div className="text-[12px] text-[#60605d]">{stage1Data.name}</div>
            <div className="text-[14px] font-bold mt-1" style={{ color: getBarColor(lowest1.score) }}>
              {lowest1.score}%
            </div>
          </div>

          <svg width="24" height="16" viewBox="0 0 24 16" fill="none" className="shrink-0">
            <path d="M0 8h16" stroke="#8c89b4" strokeWidth="2" strokeDasharray="4 2" />
            <path d="M14 4l6 4-6 4" stroke="#8c89b4" strokeWidth="2" fill="none" />
          </svg>

          <div
            className="rounded-xl px-3 py-2.5 text-center flex-1 max-w-[110px]"
            style={{
              border: `2px solid ${getBarColor(lowest2.score)}`,
              backgroundColor: `${getBarColor(lowest2.score)}10`,
            }}
          >
            <div className="text-[20px] mb-1">{stage2Data.emoji}</div>
            <div className="text-[13px] font-semibold text-[#2A2475]">{lowest2.stage}단계</div>
            <div className="text-[12px] text-[#60605d]">{stage2Data.name}</div>
            <div className="text-[14px] font-bold mt-1" style={{ color: getBarColor(lowest2.score) }}>
              {lowest2.score}%
            </div>
          </div>
        </div>

        {/* Title + Insight */}
        <h3 className="text-[16px] font-bold text-[#2A2475] mb-3 text-center">
          {insight.title}
        </h3>
        <p className="text-[14px] text-[#564a5d] leading-[1.7] mb-5">
          {insight.insight}
        </p>

        {/* Breaking point + 추천 코스를 하나의 블록으로 */}
        <div className="bg-[#f0f3fb] rounded-xl p-4">
          <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
            {"\uD83D\uDCA1"} 변화의 시작점:
          </p>
          <p className="text-[14px] text-[#374151] leading-[1.7] mb-4">
            {insight.breakingPoint}
          </p>

          {/* 추천 코스 — breakingPoint에서 자연스럽게 이어짐 */}
          {recommendedCourses.length > 0 && (
            <div className="border-t border-[#3E67C8]/15 pt-3">
              <p className="text-[12px] text-[#60605d] mb-2.5">
                이 패턴에 맞는 Cognio 훈련
              </p>
              <div className="flex flex-col gap-2">
                {recommendedCourses.map((course) => {
                  const isNotified = notified.has(course.id);
                  return (
                    <div
                      key={course.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#d0cfe1]"
                    >
                      <span className="text-[20px] flex-shrink-0">{course.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-[#2A2475]">{course.title}</p>
                        <p className="text-[11px] text-[#8c89b4]">
                          {course.lessonCount}개 레슨 · 하루 {course.minutesPerDay}분
                        </p>
                      </div>
                      <button
                        onClick={() => { if (!isNotified) handleNotify(course.id); }}
                        disabled={isNotified}
                        className={`px-3 py-2 rounded-lg font-semibold text-[12px] transition-all flex-shrink-0 ${
                          isNotified
                            ? "bg-[#f0f3fb] text-[#3E67C8] border border-[#d0cfe1]"
                            : "text-[#3E67C8] border border-[#3E67C8] active:scale-[0.95]"
                        }`}
                      >
                        {isNotified ? "등록 완료" : "앱 알림"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
