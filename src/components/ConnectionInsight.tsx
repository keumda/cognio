"use client";

import { useState } from "react";
import { connectionInsights, singleStageInsights } from "@/lib/connectionInsights";
import { stageAnalysisData } from "@/lib/stageAnalysis";
import { courses } from "@/lib/recommendations";
import { track } from "@/lib/tracking";
import { AdditionalScores } from "@/lib/additionalScoring";
import { perfectionismTypes } from "@/lib/perfectionismTypes";
import { attachmentTypes } from "@/lib/attachmentTypes";
import { emotionTypes } from "@/lib/emotionTypes";
import { initiationTypes } from "@/lib/initiationTypes";
import { useTestStore } from "@/store/useTestStore";

interface Props {
  stageScores: number[]; // [72, 38, 65, 41, 78]
  userEmail?: string;
  pathway: string;
  additionalCompleted: boolean;
  additionalScores: AdditionalScores;
}

function getBarColor(score: number): string {
  if (score >= 70) return "#3E67C8";
  if (score >= 50) return "#D6B8E8";
  return "#F36A16";
}

export default function ConnectionInsight({ stageScores, userEmail, pathway, additionalCompleted, additionalScores }: Props) {
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const allStages = stageScores
    .map((s, i) => ({ stage: i + 1, score: s }))
    .sort((a, b) => a.score - b.score);
  const lowStages = allStages.filter((x) => x.score < 50);

  // 50% 이하가 없어도 가장 낮은 단계 기준으로 표시
  const lowest1 = lowStages[0] || allStages[0];
  const isCombo = lowStages.length >= 2;
  const lowest2 = isCombo ? lowStages[1] : null;

  let insight;
  if (isCombo && lowest2) {
    const comboKey = [lowest1.stage, lowest2.stage].sort().join(",");
    insight = connectionInsights[comboKey];
  }
  if (!insight) {
    insight = singleStageInsights[String(lowest1.stage)];
  }
  if (!insight) return null;

  const stage1Data = stageAnalysisData[lowest1.stage];
  const stage2Data = lowest2 ? stageAnalysisData[lowest2.stage] : null;

  // 추천 코스 매칭 — pathway 코스를 항상 첫 번째로 포함
  const pathwayCourseMap: Record<string, string> = {
    perfectionism: "perfectionism",
    attachment: "attachment",
    emotion: "emotion",
    initiation: "initiative",
  };
  const pathwayCourseId = pathwayCourseMap[pathway] || "";
  const insightCourseIds = insight.courseIds.filter((id) => id !== pathwayCourseId);
  const finalCourseIds = pathwayCourseId
    ? [pathwayCourseId, ...insightCourseIds].slice(0, 2)
    : insight.courseIds.slice(0, 2);
  const recommendedCourses = finalCourseIds
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

  const allAbove50 = lowStages.length === 0;

  return (
    <div>
      <h2 className="text-[20px] font-bold text-[#2A2475] mb-1">
        {"\uD83D\uDD17"} 당신의 패턴은 이렇게 연결되어 있어요
      </h2>
      <p className="text-[14px] text-[#60605d] mb-5">
        {allAbove50
          ? "전반적으로 안정적인 발달 기반을 가지고 있어요"
          : isCombo
            ? "낮은 단계들이 서로 영향을 주고 있어요"
            : "이 단계의 약함이 다른 영역으로 확장될 수 있어요"}
      </p>

      {allAbove50 && (
        <div className="bg-[#f0fdf4] rounded-xl p-4 mb-4 border border-[#bbf7d0]">
          <p className="text-[14px] text-[#166534] leading-[1.7]">
            5단계 모두 50% 이상으로, 심리사회적 발달의 기본 토대가 잘 형성되어 있어요.
            이것은 큰 강점입니다. 아래는 상대적으로 더 성장할 수 있는 영역에 대한 분석이에요.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#d0cfe1] p-4">
        {/* Diagram */}
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

          {isCombo && lowest2 && stage2Data ? (
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
          ) : (
            <div className="rounded-xl px-3 py-2.5 text-center flex-1 max-w-[130px] bg-[#f0f3fb] border-2 border-dashed border-[#d0cfe1]">
              <div className="text-[14px] mb-0.5">
                {recommendedCourses.map((c) => c.emoji).join(" ")}
              </div>
              <div className="text-[12px] font-semibold text-[#2A2475]">관계 · 행동 · 감정</div>
              <div className="text-[11px] text-[#8c89b4]">파급 영역</div>
            </div>
          )}
        </div>

        {/* Title + Insight */}
        <h3 className="text-[16px] font-bold text-[#2A2475] mb-3 text-center">
          {insight.title}
        </h3>
        <p className="text-[14px] text-[#564a5d] leading-[1.7] mb-5">
          {insight.insight}
        </p>

        {/* Pathway 심화 분석 or CTA */}
        <PathwayInsightBlock
          pathway={pathway}
          additionalCompleted={additionalCompleted}
          additionalScores={additionalScores}
        />

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
                이 패턴에 맞는 COGNIO 훈련
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

const PATHWAY_LABELS: Record<string, string> = {
  perfectionism: "완벽주의",
  attachment: "애착",
  emotion: "감정조절",
  initiation: "주도성",
};

function PathwayInsightBlock({
  pathway,
  additionalCompleted,
  additionalScores,
}: {
  pathway: string;
  additionalCompleted: boolean;
  additionalScores: AdditionalScores;
}) {
  const { setScreen, setCurrentAdditionalQuestion } = useTestStore();

  if (!pathway) return null;

  // 추가 설문 미완료 → CTA
  if (!additionalCompleted) {
    return (
      <div className="my-5 bg-[#f8f6ff] rounded-xl p-4 border border-[#d0cfe1]">
        <p className="text-[13px] font-semibold text-[#2A2475] mb-3">
          {PATHWAY_LABELS[pathway]} 패턴을 더 구체적으로 분석할 수 있어요
        </p>
        <button
          onClick={() => {
            track({ event: "additional_cta_click", source: "connection_insight", pathway });
            setCurrentAdditionalQuestion(1);
            setScreen("additional");
          }}
          className="w-full py-2.5 text-[13px] font-semibold text-white bg-[#3E67C8] rounded-xl active:scale-[0.98] transition-transform"
        >
          추가 6문항 분석 받기
        </button>
      </div>
    );
  }

  // 추가 설문 완료 → pathway별 인사이트
  let content: React.ReactNode = null;

  if (pathway === "perfectionism" && additionalScores.primaryType) {
    const typeData = perfectionismTypes[additionalScores.primaryType];
    const maxScore = Math.max(additionalScores.shame || 0, additionalScores.avoidance || 0, additionalScores.proving || 0);
    const isHealthy = maxScore <= 5;
    if (typeData) {
      content = (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[18px]">{typeData.emoji}</span>
            <span className="text-[14px] font-bold text-[#2A2475]">{typeData.name}</span>
          </div>
          {isHealthy ? (
            <p className="text-[13px] text-[#166534] leading-[1.7] mb-2">
              완벽주의 성향이 비교적 건강한 수준이에요. 세 가지 유형 모두 낮아서 완벽주의가 일상을 크게 방해하지 않는 상태입니다. 다만 스트레스 상황에서 {typeData.name} 경향이 살짝 올라올 수 있으니 인식해두면 좋아요.
            </p>
          ) : (
            <>
              <p className="text-[13px] text-[#60605d] mb-2 italic">{typeData.tagline}</p>
              <p className="text-[13px] text-[#564a5d] leading-[1.7] mb-2">
                위의 연결 패턴에 {typeData.name}이 결합되면, {additionalScores.primaryType === "shame"
                  ? "실수에 대한 수치심이 더 강하게 작동하여 새로운 시도를 더욱 어렵게 만들 수 있어요."
                  : additionalScores.primaryType === "avoidance"
                    ? "시작 자체를 피하는 패턴이 더 강화되어, 해야 할 일을 계속 미루게 될 수 있어요."
                    : "끊임없이 증명해야 한다는 압박이 번아웃을 가속시킬 수 있어요."}
              </p>
            </>
          )}
          <div className="flex flex-wrap gap-1.5">
            {typeData.coreBeliefs.map((b) => (
              <span key={b} className="text-[11px] text-[#8c89b4] bg-white px-2 py-1 rounded-full border border-[#d0cfe1]">{b}</span>
            ))}
          </div>
        </>
      );
    }
  }

  if (pathway === "attachment" && additionalScores.attachmentType) {
    const typeData = attachmentTypes[additionalScores.attachmentType];
    const isSecure = additionalScores.attachmentType === "secure";
    if (typeData) {
      content = (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[18px]">{typeData.emoji}</span>
            <span className="text-[14px] font-bold text-[#2A2475]">{typeData.name} ({typeData.nameEn})</span>
          </div>
          {isSecure ? (
            <p className="text-[13px] text-[#166534] leading-[1.7] mb-2">
              안정 애착이 잘 형성되어 있어요. 관계에서 편안함을 느끼고, 도움을 주고받는 것이 자연스러운 편입니다. 이 안정감은 다른 영역의 성장에도 든든한 토대가 됩니다.
            </p>
          ) : (
            <p className="text-[13px] text-[#564a5d] leading-[1.7] mb-2">
              위의 연결 패턴에 {typeData.name} 애착이 결합되면,
              {additionalScores.attachmentType === "anxious"
                ? " 관계에서의 불안이 다른 단계의 어려움을 더 크게 느끼게 만들 수 있어요."
                : additionalScores.attachmentType === "dismissive"
                  ? " 도움을 요청하지 않는 패턴이 혼자 감당하려는 부담을 키울 수 있어요."
                  : " 관계에 대한 양가적 감정이 일상의 다른 선택에도 영향을 줄 수 있어요."}
            </p>
          )}
          <p className="text-[12px] text-[#8c89b4]">
            불안 {additionalScores.anxiety}/15 · 회피 {additionalScores.avoidanceAxis}/15
          </p>
        </>
      );
    }
  }

  if (pathway === "emotion" && additionalScores.weakestArea) {
    const typeData = emotionTypes[additionalScores.weakestArea];
    const minScore = Math.min(additionalScores.awareness || 0, additionalScores.acceptance || 0, additionalScores.strategy || 0);
    const isBalanced = minScore >= 7;
    if (typeData) {
      content = (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[18px]">{typeData.emoji}</span>
            <span className="text-[14px] font-bold text-[#2A2475]">
              {isBalanced ? "감정 조절 능력이 전반적으로 안정적이에요" : `${typeData.name}이 가장 약해요`}
            </span>
          </div>
          {isBalanced ? (
            <p className="text-[13px] text-[#166534] leading-[1.7] mb-2">
              감정 인식, 수용, 전략 세 영역이 고르게 발달해 있어요. 감정을 다루는 기초 체력이 잘 갖춰져 있다는 의미입니다. 스트레스 상황에서도 비교적 유연하게 대처할 수 있는 힘이 있어요.
            </p>
          ) : (
            <p className="text-[13px] text-[#564a5d] leading-[1.7] mb-2">
              위의 연결 패턴과 함께 {typeData.name} 영역이 약하면,
              {additionalScores.weakestArea === "awareness"
                ? " 감정을 인식하지 못한 채 쌓이다가 한꺼번에 터지는 경험이 반복될 수 있어요."
                : additionalScores.weakestArea === "acceptance"
                  ? " 감정을 억누르려는 시도가 오히려 더 큰 스트레스로 돌아올 수 있어요."
                  : " 감정은 알지만 대처 방법을 모르는 무력감이 반복될 수 있어요."}
            </p>
          )}
          <p className="text-[12px] text-[#8c89b4]">
            인식 {additionalScores.awareness} · 수용 {additionalScores.acceptance} · 전략 {additionalScores.strategy}
          </p>
        </>
      );
    }
  }

  if (pathway === "initiation" && additionalScores.primaryChallenge) {
    const typeData = initiationTypes[additionalScores.primaryChallenge];
    const maxScore = Math.max(additionalScores.fear || 0, additionalScores.energy || 0, additionalScores.focus || 0);
    const isHealthy = maxScore <= 5;
    if (typeData) {
      content = (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[18px]">{typeData.emoji}</span>
            <span className="text-[14px] font-bold text-[#2A2475]">{typeData.name}</span>
          </div>
          {isHealthy ? (
            <p className="text-[13px] text-[#166534] leading-[1.7] mb-2">
              주도성 영역이 비교적 건강한 수준이에요. 새로운 일을 시작하는 데 큰 어려움이 없고, 실행력의 기본 근육이 잘 형성되어 있습니다. 이 힘을 유지하면서 더 큰 도전에도 적용해볼 수 있어요.
            </p>
          ) : (
            <p className="text-[13px] text-[#564a5d] leading-[1.7] mb-2">
              위의 연결 패턴에 {typeData.name} 패턴이 결합되면,
              {additionalScores.primaryChallenge === "fear"
                ? " 실패에 대한 공포가 시작 자체를 막아 악순환이 더 깊어질 수 있어요."
                : additionalScores.primaryChallenge === "energy"
                  ? " 에너지 고갈로 변화를 시도할 여력 자체가 남아있지 않을 수 있어요."
                  : " 방향을 잡지 못해 시작과 포기를 반복하는 패턴이 강화될 수 있어요."}
            </p>
          )}
          <p className="text-[12px] text-[#8c89b4]">
            실패공포 {additionalScores.fear} · 에너지 {additionalScores.energy} · 집중 {additionalScores.focus}
          </p>
        </>
      );
    }
  }

  if (!content) return null;

  return (
    <div className="my-5 bg-[#f8f6ff] rounded-xl p-4 border border-[#d0cfe1]">
      <p className="text-[12px] text-[#3E67C8] font-semibold mb-2">
        {PATHWAY_LABELS[pathway]} 심화 분석과의 연결
      </p>
      {content}
    </div>
  );
}
