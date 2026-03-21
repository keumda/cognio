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
  const totalEmailSubmissions = emailList.length;
  const uniqueEmails = new Set(emailList.map((e) => e.email)).size;
  const totalShares = eventList.filter((e) => e.event === "share_click").length;

  return NextResponse.json({
    summary: {
      totalTestCompleted: totalResults,
      uniqueEmails,
      totalEmailSubmissions,
      totalShares,
      conversionRate: totalResults > 0
        ? `${((uniqueEmails / totalResults) * 100).toFixed(1)}%`
        : "0%",
    },
    emailsBySource,
    resultsByPathway,
    resultsByType,
    eventCounts,
    shareByChannel,
    // 이메일 기준 통합 유저 뷰 (같은 이메일 = 1명, 세션별 여정 포함)
    users: (() => {
      // 이메일별 그룹핑
      const grouped: Record<string, typeof emailList> = {};
      for (const e of emailList) {
        const key = e.email;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(e);
      }

      return Object.entries(grouped)
        .map(([email, entries]) => {
          const sessions = entries
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((e) => {
              const sid = e.session_id;
              const result = sid ? resultList.find((r) => r.session_id === sid) : null;
              const sessionEvents = sid ? eventList.filter((ev) => ev.session_id === sid) : [];
              return {
                session_id: sid,
                source: e.source,
                signed_up_at: e.created_at,
                nickname: result?.nickname || null,
                pathway: result?.pathway || e.pathway,
                result_type: result?.result_type || e.result_type,
                stage_scores: result?.stage_scores || null,
                additional_completed: result?.additional_completed || false,
                event_count: sessionEvents.length,
                events: sessionEvents.map((ev) => ev.event),
                shared: sessionEvents.some((ev) => ev.event === "share_click"),
                share_channels: sessionEvents
                  .filter((ev) => ev.event === "share_click" && ev.channel)
                  .map((ev) => ev.channel),
              };
            });

          const latest = sessions[sessions.length - 1];
          return {
            email,
            total_sessions: sessions.length,
            first_seen: sessions[0]?.signed_up_at || null,
            last_seen: latest?.signed_up_at || null,
            // 최근 세션 요약 (메인 행 표시용)
            latest_nickname: latest?.nickname || null,
            latest_pathway: latest?.pathway || null,
            latest_result_type: latest?.result_type || null,
            latest_stage_scores: latest?.stage_scores || null,
            latest_additional_completed: latest?.additional_completed || false,
            total_events: sessions.reduce((s, sess) => s + sess.event_count, 0),
            ever_shared: sessions.some((s) => s.shared),
            // 전체 세션 상세
            sessions,
          };
        })
        .sort((a, b) => new Date(b.last_seen || 0).getTime() - new Date(a.last_seen || 0).getTime());
    })(),
  });
}
