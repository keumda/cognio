"use client";

/**
 * ── 결과 페이지 CTA 플로우 ──
 *
 * [Locked] 레이더 + 유형 + 아코디언 2개 → 게이트(이메일/카카오) → 공유
 * [Unlocked] 아코디언 5개 → 심화분석 → 인사이트 → 코스추천(원클릭) → 공유 → 앱 탐색 CTA
 *
 * 이메일 수집은 게이트 단 1회. 이후 모든 CTA는 원클릭.
 * CTA 페이지는 "앱 소개 + 가격 탐색"용 — 이메일 재수집 없음.
 */

import { useTestStore } from "@/store/useTestStore";
import { useCallback, useEffect, useState } from "react";
import { resultTypes, stageLabels } from "@/data/resultTypes";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import StageAccordion from "@/components/StageAccordion";
import PathwayAnalysis from "@/components/PathwayAnalysis";
import ConnectionInsight from "@/components/ConnectionInsight";
import RecommendationCards from "@/components/RecommendationCards";
import { useFadeIn } from "@/hooks/useFadeIn";
import { TestResult } from "@/lib/recommendations";
import { encodeResult } from "@/lib/resultUrl";
import { track } from "@/lib/tracking";

export default function ResultScreen() {
  const {
    getStagePercentages,
    getResultType,
    getAdditionalScores,
    setScreen,
    reset,
    selectedPath,
    additionalCompleted,
    answers,
    additionalAnswers,
    nickname,
    unlocked,
    setUnlocked,
  } = useTestStore();

  const [copied, setCopied] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const percentages = getStagePercentages();
  const typeKey = getResultType();
  const typeData = resultTypes[typeKey] || resultTypes["1"];

  // Push result to URL
  useEffect(() => {
    if (selectedPath) {
      const code = encodeResult(answers, selectedPath, additionalCompleted, additionalAnswers);
      const nameParam = nickname ? `&n=${encodeURIComponent(nickname)}` : "";
      const unlockParam = unlocked ? "&u=1" : "";
      const url = `${window.location.origin}${window.location.pathname}?r=${code}${nameParam}${unlockParam}`;
      window.history.replaceState(null, "", url);
    }
  }, [answers, selectedPath, additionalCompleted, additionalAnswers, nickname, unlocked]);

  const handleUnlock = useCallback(() => {
    if (!gateEmail || !gateEmail.includes("@")) return;
    track({
      event: "email_submit",
      source: "result_gate",
      email: gateEmail,
      pathway: selectedPath || "",
      resultType: typeKey,
      additionalCompleted,
    });
    setUserEmail(gateEmail);
    setUnlocked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [gateEmail, selectedPath, typeKey, additionalCompleted, setUnlocked]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleRestart = useCallback(() => {
    reset();
  }, [reset]);

  const chartData = [
    { subject: stageLabels[1], value: percentages[1], fullMark: 100 },
    { subject: stageLabels[2], value: percentages[2], fullMark: 100 },
    { subject: stageLabels[3], value: percentages[3], fullMark: 100 },
    { subject: stageLabels[4], value: percentages[4], fullMark: 100 },
    { subject: stageLabels[5], value: percentages[5], fullMark: 100 },
  ];

  const stageScores = [
    percentages[1],
    percentages[2],
    percentages[3],
    percentages[4],
    percentages[5],
  ];

  const lowStages = Object.entries(percentages)
    .filter(([, v]) => v <= 50)
    .map(([k]) => parseInt(k));

  const additionalScores = getAdditionalScores();
  const testResult: TestResult = {
    stages: stageScores,
    pathway: selectedPath || "",
    additionalCompleted,
    additionalScores,
  };

  const [pathwayRef, pathwayVisible] = useFadeIn();
  const [connectionRef, connectionVisible] = useFadeIn();
  const [recommendationRef, recommendationVisible] = useFadeIn();

  // ── 공유 블록 (재사용) ──
  const shareBlock = (
    <div className="bg-[#f0f3fb] rounded-2xl p-5 mb-4 border border-[#d0cfe1]">
      <p className="text-[16px] font-extrabold text-[#2A2475] text-center mb-1">
        친구에게도 알려주세요
      </p>
      <p className="text-[13px] text-[#60605d] text-center mb-4">
        당신처럼 자기 이해가 필요한 사람이 주변에 있을지 몰라요
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            track({ event: "share_click", channel: "card", pathway: selectedPath || "" });
            setScreen("share");
          }}
          className="flex-1 btn-3d btn-3d-primary py-3 text-[13px]"
        >
          결과 카드 만들기
        </button>
        <button
          onClick={() => {
            track({ event: "share_click", channel: "link_copy", pathway: selectedPath || "" });
            handleCopyLink();
          }}
          className="flex-1 btn-3d btn-3d-white py-3 text-[13px]"
        >
          {copied ? "복사 완료!" : "내 결과 공유하기"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col px-6 py-6 pb-10 fade-in">
      {/* Title */}
      <h1 className="text-[24px] font-extrabold text-[#2A2475] text-center mb-4">
        {nickname ? `${nickname}님의 마음 성장 지도` : "나의 마음 성장 지도"}
      </h1>

      {/* Radar Chart */}
      <div className="w-full max-w-[320px] mx-auto mb-4" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="55%">
            <PolarGrid stroke="#d0cfe1" gridType="polygon" />
            <PolarAngleAxis
              dataKey="subject"
              tick={(props: Record<string, unknown>) => {
                const payload = props.payload as { value: string };
                const x = Number(props.x);
                const y = Number(props.y);
                const textAnchor = props.textAnchor as string;
                const stage = Object.entries(stageLabels).find(
                  ([, v]) => v === payload.value
                );
                const stageNum = stage ? parseInt(stage[0]) : 0;
                const isLow = lowStages.includes(stageNum);
                const pct = stageNum ? percentages[stageNum] : 0;
                return (
                  <g>
                    <text
                      x={x}
                      y={y}
                      textAnchor={textAnchor as "inherit" | "end" | "start" | "middle"}
                      fill="#192950"
                      fontSize={12}
                      fontWeight={600}
                    >
                      {isLow && (
                        <tspan fill="#F36A16" fontSize={10}>
                          {"● "}
                        </tspan>
                      )}
                      {payload.value}
                    </text>
                    <text
                      x={x}
                      y={y + 16}
                      textAnchor={textAnchor as "inherit" | "end" | "start" | "middle"}
                      fill="#60605d"
                      fontSize={11}
                    >
                      {pct}%
                    </text>
                  </g>
                );
              }}
            />
            <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
            <Radar
              dataKey="value"
              stroke="#3E67C8"
              fill="#3E67C8"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Type card */}
      <div className="bg-[#f0f3fb] rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[24px]">{typeData.emoji}</span>
          <h2 className="text-[18px] font-bold text-[#2A2475]">
            {typeData.name}
          </h2>
        </div>
        <p className="text-[14px] text-[#192950] leading-[1.7]">
          {typeData.description}
        </p>
      </div>

      {/* Stage accordion */}
      <div className="py-4">
        <StageAccordion stageScores={stageScores} limit={unlocked ? 5 : 2} />
      </div>

      {/* ════════ LOCKED ════════ */}
      {!unlocked ? (
        <div className="relative">
          <div className="relative">
            {/* 블러 배경 */}
            <div
              className="flex flex-col gap-3 pt-2"
              style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}
            >
              {[
                { icon: "\uD83D\uDCCA", title: `나머지 ${Math.max(stageScores.length - 2, 0)}개 단계 분석`, desc: "전체 5단계 상세 해석 · 관련 증상 · 프롬프트" },
                { icon: "\uD83D\uDD0D", title: "경로별 심화 분석", desc: "당신의 완벽주의/애착/감정 패턴 상세 프로파일" },
                { icon: "\uD83D\uDD17", title: "단계 간 연결 인사이트", desc: "낮은 단계들이 서로 어떻게 영향을 주는지" },
                { icon: "\uD83C\uDFAF", title: "맞춤 코스 추천", desc: "결과 기반 Cognio 앱 코스 매칭" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#d0cfe1]">
                  <span className="text-[20px] flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#2A2475]">{item.title}</p>
                    <p className="text-[12px] text-[#8c89b4] truncate">{item.desc}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" className="flex-shrink-0">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
              ))}
              {[0, 1, 2, 3].map((i) => (
                <div key={`skel-${i}`} className="bg-white rounded-xl border border-[#d0cfe1] p-4 flex flex-col gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#d0cfe1]" />
                    <div className="flex-1">
                      <div className="h-3.5 bg-[#d0cfe1] rounded-full w-2/3 mb-1.5" />
                      <div className="h-2.5 bg-[#d0cfe1] rounded-full w-full" />
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="h-2.5 bg-[#d0cfe1] rounded-full w-full" />
                      <div className="h-2.5 bg-[#d0cfe1] rounded-full w-4/5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA 카드 — 정중앙 */}
            <div className="absolute inset-0 flex items-center justify-center z-10 px-2">
              <div className="bg-white rounded-2xl shadow-lg border border-[#d0cfe1] p-5 w-full">
                <p className="text-[17px] font-bold text-[#2A2475] text-center mb-1 leading-[1.4]">
                  출시 알림 받고 계속 보기
                </p>
                <p className="text-[13px] text-[#60605d] text-center mb-5 leading-[1.6]">
                  매일 5분, 마음을 들여다보는 습관.
                  <br />
                  앱 출시 시 가장 먼저 알려드릴게요.
                </p>

                {/* 카카오 Primary */}
                <button
                  onClick={() => {
                    track({ event: "email_submit", source: "result_gate_kakao", pathway: selectedPath || "", resultType: typeKey, additionalCompleted });
                    window.open("https://pf.kakao.com/_cognio", "_blank");
                    setUnlocked(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full py-3.5 btn-3d btn-3d-kakao text-[14px] mb-2.5 flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#391B1B">
                    <path d="M12 3C6.48 3 2 6.58 2 10.95c0 2.82 1.86 5.29 4.66 6.69-.15.56-.96 3.58-1 3.73 0 .07.03.14.09.18a.16.16 0 00.15.01c.21-.03 2.43-1.6 3.45-2.34.54.08 1.09.12 1.65.12 5.52 0 10-3.58 10-7.95S17.52 3 12 3z" />
                  </svg>
                  카카오톡 알림 받기
                </button>

                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex-1 h-px bg-[#d0cfe1]" />
                  <span className="text-[11px] text-[#8c89b4]">또는</span>
                  <div className="flex-1 h-px bg-[#d0cfe1]" />
                </div>

                {/* 이메일 Secondary */}
                <div className="flex flex-col gap-2 mb-3">
                  <input
                    type="email"
                    value={gateEmail}
                    onChange={(e) => setGateEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleUnlock(); }}
                    placeholder="이메일 주소"
                    className="w-full px-4 py-3 rounded-xl text-[14px] border-2 border-[#d0cfe1] outline-none focus:border-[#3E67C8] transition-colors"
                  />
                  <button
                    onClick={handleUnlock}
                    className="w-full py-3 btn-3d btn-3d-white text-[13px] text-[#3E67C8]"
                  >
                    이메일로 받기
                  </button>
                </div>

                <p className="text-[11px] text-[#8c89b4] text-center">
                  앱 출시 소식과 매주 마음 인사이트를 보내드릴게요
                </p>
              </div>
            </div>
          </div>

          {/* 공유 */}
          <div className="mt-8">{shareBlock}</div>
        </div>
      ) : (
        <>
          {/* ════════ UNLOCKED ════════ */}

          <div
            ref={pathwayRef}
            className="py-6 transition-all duration-500"
            style={{
              opacity: pathwayVisible ? 1 : 0,
              transform: pathwayVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <PathwayAnalysis />
          </div>

          <div
            ref={connectionRef}
            className="py-6 transition-all duration-500"
            style={{
              opacity: connectionVisible ? 1 : 0,
              transform: connectionVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <ConnectionInsight stageScores={stageScores} userEmail={userEmail} />
          </div>

          <div
            ref={recommendationRef}
            className="py-6 transition-all duration-500"
            style={{
              opacity: recommendationVisible ? 1 : 0,
              transform: recommendationVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <RecommendationCards testResult={testResult} userEmail={userEmail} />
          </div>

          {/* 공유 */}
          {shareBlock}

          {/* 앱 탐색 CTA — 가격/기능 탐색용 (이메일 재수집 없음) */}
          <button
            onClick={() => {
              track({ event: "cta_explore_click", pathway: selectedPath || "", resultType: typeKey, additionalCompleted });
              setScreen("cta");
            }}
            className="w-full py-3.5 btn-3d btn-3d-white text-[14px] text-[#2A2475] mb-3"
          >
            Cognio 앱 자세히 알아보기
          </button>
        </>
      )}

      {/* ════════ ALWAYS VISIBLE ════════ */}

      {/* 이론 기반 */}
      <div className="bg-[#f0f3fb] rounded-xl p-4 mt-4 mb-2">
        <p className="text-[13px] font-semibold text-[#2A2475] mb-2">
          {"\uD83D\uDCDA"} 이 분석의 이론적 기반
        </p>
        <div className="flex flex-col gap-1.5 mb-3">
          <p className="text-[12px] text-[#4B5563] leading-[1.6]">
            <span className="font-semibold">Erik Erikson의 심리사회적 발달 이론</span>을
            기반으로 신뢰, 자율, 주도, 근면, 정체성 5단계를 측정합니다.
          </p>
          <p className="text-[12px] text-[#4B5563] leading-[1.6]">
            추가 분석에는 <span className="font-semibold">Hewitt &amp; Flett의 다차원 완벽주의 척도</span>,{" "}
            <span className="font-semibold">Bartholomew의 애착 유형 모델</span>,{" "}
            <span className="font-semibold">Gross의 감정조절 이론</span>이 반영되었습니다.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px]">{"\uD83C\uDF93"}</span>
          <p className="text-[11px] text-[#60605d]">
            임상심리전문가 감수 · 심리학 학술 이론 기반 설계
          </p>
        </div>
      </div>

      {/* 면책 */}
      <div className="mb-2">
        <p className="text-[11px] text-[#8c89b4] leading-[1.8] text-center">
          본 테스트는 임상 진단 도구가 아닌
          자기 이해 목적의 심리교육 콘텐츠입니다.
          <br />
          심각한 어려움이 있다면
          전문 상담사 또는 정신건강의학과 전문의와 상담을 권합니다.
        </p>
      </div>

      <button
        onClick={handleRestart}
        className="w-full py-3 text-[13px] text-[#60605d] active:text-[#2A2475] transition-colors"
      >
        처음부터 다시하기
      </button>
    </div>
  );
}
