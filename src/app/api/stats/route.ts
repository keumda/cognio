import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  // 간단한 토큰 보호 — ?token=서비스롤키 앞 8자
  const token = req.nextUrl.searchParams.get("token");
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 8);
  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [emails, results, events] = await Promise.all([
    supabaseAdmin.from("emails").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("test_results").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("events").select("*").order("created_at", { ascending: false }),
  ]);

  // --- 집계 ---
  const emailList = emails.data || [];
  const resultList = results.data || [];
  const eventList = events.data || [];

  // 이메일 수집 통계
  const emailsBySource: Record<string, number> = {};
  for (const e of emailList) {
    emailsBySource[e.source] = (emailsBySource[e.source] || 0) + 1;
  }

  // pathway별 테스트 완료 수
  const resultsByPathway: Record<string, number> = {};
  for (const r of resultList) {
    resultsByPathway[r.pathway] = (resultsByPathway[r.pathway] || 0) + 1;
  }

  // resultType별 분포
  const resultsByType: Record<string, number> = {};
  for (const r of resultList) {
    resultsByType[r.result_type] = (resultsByType[r.result_type] || 0) + 1;
  }

  // 이벤트별 카운트
  const eventCounts: Record<string, number> = {};
  for (const e of eventList) {
    eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
  }

  // 공유 채널별 카운트
  const shareByChannel: Record<string, number> = {};
  for (const e of eventList) {
    if (e.event === "share_click" && e.channel) {
      shareByChannel[e.channel] = (shareByChannel[e.channel] || 0) + 1;
    }
  }

  // 퍼널 전환율
  const totalResults = resultList.length;
  const totalEmails = emailList.length;
  const totalShares = eventList.filter((e) => e.event === "share_click").length;

  return NextResponse.json({
    summary: {
      totalTestCompleted: totalResults,
      totalEmailsCollected: totalEmails,
      totalShares,
      conversionRate: totalResults > 0
        ? `${((totalEmails / totalResults) * 100).toFixed(1)}%`
        : "0%",
    },
    emailsBySource,
    resultsByPathway,
    resultsByType,
    eventCounts,
    shareByChannel,
    recentEmails: emailList.slice(0, 20),
    recentResults: resultList.slice(0, 20).map((r) => ({
      id: r.id,
      nickname: r.nickname,
      pathway: r.pathway,
      result_type: r.result_type,
      stage_scores: r.stage_scores,
      unlocked: r.unlocked,
      created_at: r.created_at,
    })),
    // session 기반 통합 뷰: 이메일 제출한 유저의 전체 여정
    users: emailList.map((e) => {
      const sid = e.session_id;
      const result = sid ? resultList.find((r) => r.session_id === sid) : null;
      const userEvents = sid ? eventList.filter((ev) => ev.session_id === sid) : [];
      return {
        email: e.email,
        source: e.source,
        session_id: sid,
        signed_up_at: e.created_at,
        // 테스트 결과
        nickname: result?.nickname || null,
        pathway: result?.pathway || e.pathway,
        result_type: result?.result_type || e.result_type,
        stage_scores: result?.stage_scores || null,
        additional_completed: result?.additional_completed || false,
        unlocked: result?.unlocked || false,
        // 이벤트 요약
        event_count: userEvents.length,
        events: userEvents.map((ev) => ev.event),
        shared: userEvents.some((ev) => ev.event === "share_click"),
        share_channels: userEvents
          .filter((ev) => ev.event === "share_click" && ev.channel)
          .map((ev) => ev.channel),
      };
    }),
  });
}
