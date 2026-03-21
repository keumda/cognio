/**
 * Cognio Fake Door 트래킹 유틸리티
 *
 * Supabase events 테이블 + localStorage 이중 저장.
 * Supabase 실패 시 localStorage 폴백.
 *
 * ── 분석 가이드 ──
 *
 * [퍼널 전환율]
 * 1. result_view → rec_impression: 추천 카드가 보였는가 (스크롤 도달)
 * 2. rec_impression → rec_click: 어떤 프로그램이 클릭되었는가
 * 3. rec_click → email_submit: 이메일 전환율 (프로그램별)
 * 4. result_view → share_click: 공유 전환율 (채널별)
 *
 * [Fake Door 수요 검증]
 * - journal_click / journal_email: Journal 사전예약 수요
 * - coaching_click / coaching_email: 코칭 수요
 * - rec별 email_submit 수: 프로그램별 수요 비교
 *
 * [유저 세그먼트별 분석]
 * - pathway별 전환율 차이 → 어떤 경로 유저가 가장 전환이 높은가
 * - resultType별 → 어떤 유형이 가장 액션을 많이 하는가
 * - additionalCompleted별 → 추가 문항 유저가 전환율이 더 높은가
 *
 * [최적화 포인트]
 * - rec_impression 대비 rec_click이 낮으면 → 추천 카드 카피/디자인 개선
 * - rec_click 대비 email_submit이 낮으면 → 이메일 입력 UX 개선
 * - share_click 중 channel별 비율 → 어떤 공유 채널에 집중할지
 */

import { supabase } from "./supabase";
import { useTestStore } from "@/store/useTestStore";

export interface TrackEvent {
  event: string;
  timestamp?: string;
  // 유저 컨텍스트
  pathway?: string;
  resultType?: string;
  additionalCompleted?: boolean;
  // 이벤트별 추가 데이터
  programId?: string;
  channel?: string; // "instagram" | "kakao" | "link_copy" | "download"
  source?: string; // "result_hero" | "result_secondary" | "cta_notify" | "cta_journal" | "cta_coaching"
  email?: string;
  feedback?: string;
  value?: string;
}

export function track(event: TrackEvent) {
  // localStorage 폴백 (항상)
  try {
    const existing: TrackEvent[] = JSON.parse(
      localStorage.getItem("rewrite_events") || "[]"
    );
    existing.push({ ...event, timestamp: new Date().toISOString() });
    localStorage.setItem("rewrite_events", JSON.stringify(existing));
  } catch {
    // ignore
  }

  // Supabase 저장 (비동기, fire-and-forget)
  supabase
    .from("events")
    .insert({
      session_id: useTestStore.getState().sessionId,
      event: event.event,
      pathway: event.pathway || null,
      result_type: event.resultType || null,
      additional_completed: event.additionalCompleted ?? null,
      program_id: event.programId || null,
      channel: event.channel || null,
      source: event.source || null,
      email: event.email || null,
      feedback: event.feedback || null,
      value: event.value || null,
    })
    .then(({ error }) => {
      if (error) console.error("Failed to track event:", error.message);
    });
}

/** 특정 이벤트 타입의 발생 횟수 (localStorage 기준, 현재 세션용) */
export function getEventCount(eventName: string): number {
  try {
    const events: TrackEvent[] = JSON.parse(
      localStorage.getItem("rewrite_events") || "[]"
    );
    return events.filter((e) => e.event === eventName).length;
  } catch {
    return 0;
  }
}
