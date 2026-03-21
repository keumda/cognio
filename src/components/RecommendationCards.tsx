"use client";

/**
 * ── 코스 추천 (언락 후) ──
 *
 * 이메일은 게이트에서 이미 수집됨 → 여기서는 원클릭 "알림 받기"만.
 * 마찰 최소화로 코스별 수요 데이터를 최대한 수집.
 *
 * Track:
 * - course_impression: hero 코스 노출
 * - course_notify (programId): 코스별 알림 신청 (원클릭)
 * - course_list_opened: 다른 코스 펼침
 *
 * 분석: 코스별 notify 수 = 론칭 시 우선개발 순서
 */

import { useState, useCallback, useEffect } from "react";
import { courses, TestResult } from "@/lib/recommendations";
import { track, getEventCount } from "@/lib/tracking";

interface Props {
  testResult: TestResult;
  userEmail: string;
}

export default function RecommendationCards({ testResult, userEmail }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [notified, setNotified] = useState<Set<string>>(new Set());

  // pathway에 매칭되는 코스를 hero로 우선 표시
  const pathwayCourseMap: Record<string, string> = {
    perfectionism: "perfectionism",
    attachment: "attachment",
    emotion: "emotion",
    initiation: "initiative",
  };
  const pathwayCourseId = pathwayCourseMap[testResult.pathway];
  const pathwayCourse = courses.find((c) => c.id === pathwayCourseId);
  const matched = courses.filter((c) => c.condition(testResult) && c.id !== pathwayCourseId);
  const hero = pathwayCourse || matched[0] || courses[0];
  const rest = courses.filter((c) => c.id !== hero.id);

  useEffect(() => {
    const count = getEventCount("course_notify");
    setWaitlistCount(127 + count);
  }, [notified]);

  useEffect(() => {
    track({
      event: "course_impression",
      programId: hero.id,
      pathway: testResult.pathway,
      additionalCompleted: testResult.additionalCompleted,
    });
  }, [hero.id, testResult.pathway, testResult.additionalCompleted]);

  const handleNotify = useCallback(
    (courseId: string) => {
      track({
        event: "course_notify",
        programId: courseId,
        email: userEmail,
        pathway: testResult.pathway,
        additionalCompleted: testResult.additionalCompleted,
      });
      setNotified((prev) => new Set(prev).add(courseId));
    },
    [userEmail, testResult]
  );

  return (
    <div>
      {/* Section header */}
      <p className="text-[13px] text-[#46C5B8] font-semibold mb-1 tracking-wide">
        COGNIO APP
      </p>
      <h2 className="text-[20px] font-bold text-[#2A2475] mb-1">
        하루 5분, 게임처럼 배우는 마음 근육
      </h2>
      <p className="text-[14px] text-[#60605d] mb-2">
        당신의 결과에 맞는 코스를 추천해드려요
      </p>
      <p className="text-[12px] text-[#8c89b4] mb-5">
        임상심리전문가 설계 · CBT/ACT 기반 마이크로 러닝
      </p>

      {/* ====== Hero 코스 카드 ====== */}
      <div
        className="rounded-2xl overflow-hidden mb-3"
        style={{ background: "linear-gradient(135deg, #2A2475 0%, #3E67C8 100%)" }}
      >
        <div className="p-5 pb-0">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px]"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {hero.emoji}
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold text-[#2A2475] bg-[#46C5B8] px-2.5 py-0.5 rounded-full mb-1">
                당신을 위한 코스
              </span>
              <h3 className="text-[18px] font-bold text-white leading-tight">
                {hero.title}
              </h3>
            </div>
          </div>
          <p className="text-[14px] text-white/70 leading-[1.5] mb-3">
            {hero.subtitle}
          </p>
          <div className="flex gap-4 mb-4">
            <span className="text-[12px] text-white/50 flex items-center gap-1">
              {"\uD83D\uDCDA"} {hero.lessonCount}개 레슨
            </span>
            <span className="text-[12px] text-white/50 flex items-center gap-1">
              {"\u23F1"} 하루 {hero.minutesPerDay}분
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hero.topics.map((topic) => (
              <span
                key={topic}
                className="text-[11px] text-white/60 px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
          {notified.has(hero.id) ? (
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-[15px] text-[#2A2475] font-bold mb-1">
                {"\uD83C\uDF89"} Cognio 앱 대기 등록 완료!
              </p>
              <p className="text-[13px] text-[#60605d]">
                앱 출시 시 이 코스를 가장 먼저 시작할 수 있어요
              </p>
            </div>
          ) : (
            <button
              onClick={() => handleNotify(hero.id)}
              className="btn-3d btn-3d-white w-full py-3.5 text-[15px] text-[#2A2475]"
            >
              Cognio 앱에서 이 코스 시작하기
            </button>
          )}
          <p className="text-[11px] text-white/30 mt-3 text-center">
            {waitlistCount.toLocaleString()}명이 Cognio 앱을 기다리고 있어요
          </p>
        </div>
      </div>

      {/* ====== 다른 코스 토글 ====== */}
      <div className="mt-1">
        <button
          onClick={() => {
            setShowMore(!showMore);
            if (!showMore) {
              track({ event: "course_list_opened", pathway: testResult.pathway });
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 py-3 text-[13px] text-[#60605d]"
        >
          다른 코스 {rest.length}개 더 보기
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300"
            style={{ transform: showMore ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: showMore ? `${rest.length * 180}px` : "0px",
            opacity: showMore ? 1 : 0,
          }}
        >
          <div className="flex flex-col gap-2.5 pt-1">
            {rest.map((course) => {
              const isNotified = notified.has(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl p-4 border border-[#d0cfe1] flex items-center gap-3"
                >
                  <span className="text-[24px] flex-shrink-0">{course.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-[#2A2475]">
                      {course.title}
                    </h4>
                    <p className="text-[12px] text-[#8c89b4]">
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
      </div>
    </div>
  );
}
