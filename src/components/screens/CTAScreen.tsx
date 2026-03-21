"use client";

/**
 * ── CTA 페이지: Cognio 앱 탐색 ──
 *
 * 이메일은 결과 게이트에서 이미 수집됨.
 * 이 페이지는 순수 탐색 + 플랜별 관심도 측정용.
 * 모든 CTA는 원클릭 (이메일 재입력 없음).
 *
 * ── Fake Door 구조 ──
 * 플랜 카드의 "관심 있어요" 버튼 클릭 수로 수요 측정.
 * Track: super_interest, max_interest, coach_interest, family_interest
 *
 * ── 분석 ──
 * 플랜별 관심 수 비교 = 가격 수용도 + ARPU 추정
 * AI(Max) vs Human(Coach) 비율 = 핵심 PMF 시그널
 * pathway별 플랜 선호 = 세그먼트별 monetization 전략
 */

import { useState, useEffect } from "react";
import { useTestStore } from "@/store/useTestStore";
import { track, getEventCount } from "@/lib/tracking";

export default function CTAScreen() {
  const { setScreen, selectedPath, additionalCompleted, getResultType } =
    useTestStore();
  const resultType = getResultType();

  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [interested, setInterested] = useState<Set<string>>(new Set());

  const ctx = { pathway: selectedPath || "", resultType, additionalCompleted };

  useEffect(() => {
    track({ event: "cta_page_view", ...ctx });
    const count = getEventCount("email_submit");
    setWaitlistCount(127 + count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInterest = (planId: string) => {
    track({ event: `${planId}_interest`, ...ctx });
    setInterested((prev) => new Set(prev).add(planId));
  };

  return (
    <div className="flex flex-col px-6 py-6 fade-in">
      {/* Back */}
      <button
        onClick={() => setScreen("result")}
        className="text-[#60605d] text-[14px] mb-4 self-start flex items-center gap-1"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        결과로 돌아가기
      </button>

      {/* Header */}
      <div className="text-center mb-5">
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#46C5B8] mb-2">COGNIO</p>
        <h1 className="text-[22px] font-bold text-[#2A2475] mb-2 leading-[1.3]">
          마음 근육을 키우는<br />가장 과학적인 방법
        </h1>
        <p className="text-[14px] text-[#60605d] mb-3">
          심리학 이론 기반 · 매일 5분 · 게임처럼 쉽게
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { emoji: "\uD83C\uDF93", text: "임상심리전문가 개발" },
            { emoji: "\uD83D\uDCDA", text: "Erikson 발달이론 기반" },
            { emoji: "\uD83E\uDDE0", text: "CBT · ACT 원리 적용" },
          ].map((b) => (
            <span key={b.text} className="text-[11px] text-[#2A2475] font-medium bg-[#f0f3fb] px-3 py-1.5 rounded-full">
              {b.emoji} {b.text}
            </span>
          ))}
        </div>
      </div>

      {/* 앱 기능 미리보기 */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { icon: "\uD83C\uDFAF", label: "맞춤 코스" },
          { icon: "\uD83D\uDD25", label: "데일리 스트릭" },
          { icon: "\uD83D\uDCCA", label: "성장 리포트" },
          { icon: "\uD83D\uDC65", label: "커뮤니티" },
        ].map((f) => (
          <div key={f.label} className="flex-1 bg-[#f0f3fb] rounded-xl py-3 text-center">
            <div className="text-[20px] mb-1">{f.icon}</div>
            <p className="text-[11px] text-[#2A2475] font-medium">{f.label}</p>
          </div>
        ))}
      </div>

      {/* 소셜 프루프 */}
      <p className="text-[13px] text-[#60605d] text-center mb-5">
        {waitlistCount.toLocaleString()}명이 COGNIO 앱을 기다리고 있어요
      </p>

      {/* ── 플랜 비교 ── */}
      <h3 className="text-[16px] font-bold text-[#2A2475] mb-3 text-center">
        어떤 플랜이 끌리세요?
      </h3>
      <p className="text-[12px] text-[#8c89b4] text-center mb-4">
        관심 있는 플랜을 탭해주세요 · 앱 설계에 반영할게요
      </p>

      <div className="flex flex-col gap-2.5 mb-6">
        {/* Free */}
        <div className="rounded-xl p-4 border border-[#d0cfe1] bg-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[16px] font-bold text-[#2A2475]">Free</h4>
            <p className="text-[17px] font-bold text-[#3E67C8]">무료</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {["하루 1레슨", "기본 코스 1개", "광고 포함"].map((f) => (
              <span key={f} className="text-[12px] text-[#60605d] flex items-center gap-1">
                <span className="text-[#8c89b4]">{"\u2713"}</span> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Super */}
        <PlanCard
          name="Super"
          badge="MOST POPULAR"
          badgeColor="#46C5B8"
          price="월 14,900원"
          annual="연간 89,900원 (월 7,500원)"
          features={["무제한 레슨", "전체 코스 해금", "광고 제거", "오프라인 모드", "스트릭 리페어"]}
          interested={interested.has("super")}
          onInterest={() => handleInterest("super")}
          highlight
        />

        {/* Max */}
        <PlanCard
          name="Max"
          badge="AI POWERED"
          badgeColor="#3E67C8"
          price="월 29,900원"
          annual="연간 199,000원 (월 16,600원)"
          features={["Super 전체 기능", "AI 코칭 대화", "감정 롤플레이", "심층 분석 리포트", "전문가 Q&A"]}
          interested={interested.has("max")}
          onInterest={() => handleInterest("max")}
        />

        {/* Coach */}
        <PlanCard
          name="Coach"
          badge="HUMAN EXPERT"
          badgeColor="#2A2475"
          price="월 79,000원"
          features={["Max 전체 기능", "월 1회 전문가 코칭 (50분)", "앱 데이터 기반 맞춤 피드백", "코칭 노트 & 과제 제공"]}
          description="임상심리 전문가가 앱 데이터를 분석하고 월 1회 1:1 코칭을 제공합니다."
          interested={interested.has("coach")}
          onInterest={() => handleInterest("coach")}
        />

        {/* Family */}
        <PlanCard
          name="Family"
          price="연 149,000원"
          subprice="최대 6명 · 인당 월 2,100원"
          features={["Super 전체 기능", "최대 6명 공유", "가족/친구 함께"]}
          interested={interested.has("family")}
          onInterest={() => handleInterest("family")}
        />
      </div>

      {/* 카카오 채널 */}
      <div className="bg-[#f0f3fb] rounded-xl p-4 mb-6 text-center">
        <p className="text-[13px] text-[#2A2475] font-medium mb-3">
          카카오톡 오픈채팅에서도 소식을 받을 수 있어요
        </p>
        <button
          onClick={() => {
            track({ event: "kakao_channel_click", ...ctx });
            window.open("https://open.kakao.com/o/pttGhymi", "_blank");
          }}
          className="w-full py-3 rounded-xl font-semibold text-[14px] active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: "#FEE500", color: "#391B1B" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#391B1B">
            <path d="M12 3C6.48 3 2 6.58 2 10.95c0 2.82 1.86 5.29 4.66 6.69-.15.56-.96 3.58-1 3.73 0 .07.03.14.09.18a.16.16 0 00.15.01c.21-.03 2.43-1.6 3.45-2.34.54.08 1.09.12 1.65.12 5.52 0 10-3.58 10-7.95S17.52 3 12 3z" />
          </svg>
          COGNIO 오픈채팅 참여하기
        </button>
      </div>

      {/* 피드백 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#d0cfe1] mb-6">
        <h2 className="text-[15px] font-bold text-[#2A2475] mb-2">
          어떤 기능이 가장 기대되세요?
        </h2>
        <p className="text-[13px] text-[#60605d] mb-4 leading-[1.5]">
          여러분의 의견으로 더 좋은 앱을 만들게요.
        </p>
        {feedbackSubmitted ? (
          <div className="bg-[#f0f3fb] rounded-xl p-4 text-center">
            <p className="text-[14px] text-[#2A2475] font-medium">
              소중한 의견 감사합니다 {"\uD83D\uDC9A"}
            </p>
          </div>
        ) : (
          <>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="예: 매일 알림이 왔으면 좋겠어요 / AI 코칭이 궁금해요 / ..."
              className="w-full px-4 py-3 rounded-xl border-2 border-[#d0cfe1] text-[14px] outline-none focus:border-[#3E67C8] transition-colors resize-none h-[100px] mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFeedbackSubmitted(true)}
                className="text-[13px] text-[#60605d] px-4 py-2"
              >
                다음에 할게요
              </button>
              <button
                onClick={() => {
                  if (!feedback.trim()) return;
                  track({ event: "feedback_submit", feedback: feedback.trim(), ...ctx });
                  setFeedbackSubmitted(true);
                }}
                className="px-5 py-2 rounded-xl font-semibold text-[13px] text-white"
                style={{ backgroundColor: "#3E67C8" }}
              >
                의견 보내기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── 플랜 카드 컴포넌트 ──
function PlanCard({
  name,
  badge,
  badgeColor,
  price,
  annual,
  subprice,
  features,
  description,
  interested,
  onInterest,
  highlight,
}: {
  name: string;
  badge?: string;
  badgeColor?: string;
  price: string;
  annual?: string;
  subprice?: string;
  features: string[];
  description?: string;
  interested: boolean;
  onInterest: () => void;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 bg-white relative ${
        highlight ? "border-2 border-[#46C5B8]" : "border border-[#d0cfe1]"
      }`}
    >
      {badge && (
        <span
          className="absolute -top-2.5 left-4 text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: badgeColor }}
        >
          {badge}
        </span>
      )}
      <div className={`flex items-center justify-between mb-2 ${badge ? "mt-1" : ""}`}>
        <h4 className="text-[16px] font-bold text-[#2A2475]">{name}</h4>
        <div className="text-right">
          <p className="text-[17px] font-bold text-[#2A2475]">{price}</p>
          {annual && (
            <p className="text-[11px] text-[#60605d]">{annual}</p>
          )}
          {subprice && (
            <p className="text-[11px] text-[#60605d]">{subprice}</p>
          )}
        </div>
      </div>
      {description && (
        <p className="text-[13px] text-[#60605d] mb-3 leading-[1.5]">{description}</p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        {features.map((f) => (
          <span key={f} className="text-[12px] text-[#564a5d] flex items-center gap-1">
            <span className="text-[#3E67C8]">{"\u2713"}</span> {f}
          </span>
        ))}
      </div>
      <button
        onClick={() => { if (!interested) onInterest(); }}
        disabled={interested}
        className={`w-full py-3 rounded-xl font-semibold text-[14px] transition-all ${
          interested
            ? "bg-[#f0f3fb] text-[#3E67C8] border border-[#d0cfe1]"
            : highlight
              ? "text-white active:scale-[0.97]"
              : "border-2 border-[#3E67C8] text-[#3E67C8] active:scale-[0.97]"
        }`}
        style={!interested && highlight ? { backgroundColor: "#46C5B8" } : undefined}
      >
        {interested ? "관심 등록 완료!" : "이 플랜에 관심 있어요"}
      </button>
    </div>
  );
}
