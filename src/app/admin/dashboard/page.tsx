"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// --- Types ---

interface SessionEvent {
  event: string;
  channel: string | null;
  source: string | null;
  program_id: string | null;
  feedback: string | null;
  created_at: string;
}

interface UserSession {
  session_id: string;
  source: string;
  signed_up_at: string;
  nickname: string | null;
  pathway: string;
  result_type: string;
  stage_scores: Record<string, number> | null;
  answers: Record<string, number> | null;
  additional_completed: boolean;
  additional_answers: Record<string, number> | null;
  additional_scores: Record<string, unknown> | null;
  event_count: number;
  events: SessionEvent[];
  shared: boolean;
  share_channels: string[];
}

interface GroupedUser {
  email: string;
  total_sessions: number;
  first_seen: string | null;
  last_seen: string | null;
  latest_nickname: string | null;
  latest_pathway: string | null;
  latest_result_type: string | null;
  latest_stage_scores: Record<string, number> | null;
  latest_additional_completed: boolean;
  total_events: number;
  ever_shared: boolean;
  sessions: UserSession[];
}

interface DistEntry { total: number; unique: number }

interface Stats {
  summary: {
    totalTestCompleted: number;
    uniqueEmails: number;
    totalEmailSubmissions: number;
    totalShares: number;
    conversionRate: string;
  };
  emailsBySource: Record<string, number>;
  resultsByPathway: Record<string, DistEntry>;
  resultsByType: Record<string, DistEntry>;
  eventCounts: Record<string, number>;
  shareByChannel: Record<string, number>;
  users: GroupedUser[];
}

// --- Constants ---

const PATHWAY_LABELS: Record<string, string> = {
  perfectionism: "완벽주의",
  attachment: "애착",
  emotion: "감정조절",
  initiation: "주도성",
};

const SOURCE_LABELS: Record<string, string> = {
  result_gate: "이메일",
  result_gate_kakao: "카카오",
};

const STAGE_LABELS: Record<string, string> = {
  "1": "신뢰",
  "2": "자율",
  "3": "시작",
  "4": "성취",
  "5": "정체성",
};

// --- Helpers ---

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function Pill({ children, color = "gray" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-600",
    yellow: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

function StageBar({ scores, showNumbers = false }: { scores: Record<string, number> | null; showNumbers?: boolean }) {
  if (!scores) return <span className="text-[12px] text-gray-400">-</span>;
  return (
    <div className="flex gap-1.5 items-end">
      {["1", "2", "3", "4", "5"].map((k) => {
        const v = scores[k] ?? 0;
        const color = v <= 33 ? "bg-red-400" : v <= 60 ? "bg-yellow-400" : "bg-green-400";
        return (
          <div key={k} className="flex flex-col items-center gap-0.5">
            {showNumbers && <span className="text-[10px] text-gray-500">{v}%</span>}
            <div className={`w-4 rounded-sm ${color}`} style={{ height: `${Math.max(v * 0.3, 3)}px` }} />
            <span className="text-[9px] text-gray-400">{STAGE_LABELS[k]?.[0]}</span>
          </div>
        );
      })}
    </div>
  );
}

function resultTypeLabel(rt: string | null) {
  if (!rt) return "-";
  return rt.split(",").map((s) => STAGE_LABELS[s] || s).join("+") + " 취약";
}

// --- Main ---

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/stats?token=eyJhbGci");
    if (!res.ok) {
      setError("데이터를 불러오지 못했습니다.");
      setLoading(false);
      return;
    }
    setStats(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  if (loading) {
    return <div className="min-h-dvh flex items-center justify-center bg-[#f5f5f7]"><p className="text-[14px] text-[#8c89b4]">로딩 중...</p></div>;
  }
  if (error || !stats) {
    return <div className="min-h-dvh flex items-center justify-center bg-[#f5f5f7]"><p className="text-[14px] text-red-500">{error}</p></div>;
  }

  const { summary, emailsBySource, resultsByPathway, resultsByType, eventCounts, shareByChannel, users } = stats;

  const funnelSteps = [
    { label: "테스트 완료", value: summary.totalTestCompleted },
    { label: "이메일 수집", value: summary.uniqueEmails },
    { label: "공유", value: summary.totalShares },
    { label: "CTA 탐색", value: eventCounts["cta_explore_click"] || 0 },
    { label: "CTA 페이지", value: eventCounts["cta_page_view"] || 0 },
    { label: "요금제 관심", value: Object.entries(eventCounts).filter(([k]) => k.endsWith("_interest")).reduce((s, [, v]) => s + v, 0) },
  ];
  const maxFunnel = Math.max(...funnelSteps.map((f) => f.value), 1);

  return (
    <div className="min-h-dvh bg-[#f5f5f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#2A2475]">COGNIO Dashboard</h1>
            <p className="text-[12px] text-[#8c89b4]">마케팅 분석</p>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={fetchStats} className="px-4 py-2 text-[13px] text-[#3E67C8] border border-[#3E67C8] rounded-lg hover:bg-[#3E67C8] hover:text-white transition-colors">새로고침</button>
            <button onClick={handleLogout} className="px-4 py-2 text-[13px] text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">로그아웃</button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "테스트 완료", value: summary.totalTestCompleted, sub: "총 완료 수", color: "text-[#2A2475]" },
            { label: "이메일 수집", value: summary.uniqueEmails, sub: `총 ${summary.totalEmailSubmissions}건 (재방문 포함)`, color: "text-[#3E67C8]" },
            { label: "전환율", value: summary.conversionRate, sub: "테스트 → 이메일", color: "text-green-600" },
            { label: "공유", value: summary.totalShares, sub: Object.entries(shareByChannel).map(([k, v]) => `${k}: ${v}`).join(", ") || "아직 없음", color: "text-orange-600" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-[12px] text-gray-500 mb-1">{card.label}</p>
              <p className={`text-[28px] font-bold ${card.color}`}>{card.value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Row 2: Pathway + Result Type + Email Source */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pathway */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-[14px] font-semibold text-[#2A2475] mb-4">경로별 분포</h3>
            {Object.entries(resultsByPathway).length === 0 ? (
              <p className="text-[13px] text-gray-400">아직 데이터 없음</p>
            ) : (
              <div className="flex flex-col gap-3">
                {Object.entries(resultsByPathway).sort((a, b) => b[1].total - a[1].total).map(([pathway, { total, unique }]) => {
                  const pct = summary.totalTestCompleted > 0 ? Math.round((total / summary.totalTestCompleted) * 100) : 0;
                  return (
                    <div key={pathway}>
                      <div className="flex justify-between text-[13px] mb-1">
                        <span className="text-gray-700">{PATHWAY_LABELS[pathway] || pathway}</span>
                        <span className="text-gray-500">
                          {total}건
                          <span className="text-[11px] text-[#3E67C8] ml-1">({unique}명)</span>
                          <span className="text-[11px] text-gray-400 ml-1">{pct}%</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-[#3E67C8] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Result Type */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-[14px] font-semibold text-[#2A2475] mb-4">유형별 분포</h3>
            {Object.entries(resultsByType).length === 0 ? (
              <p className="text-[13px] text-gray-400">아직 데이터 없음</p>
            ) : (
              <div className="flex flex-col gap-2">
                {Object.entries(resultsByType).sort((a, b) => b[1].total - a[1].total).map(([type, { total, unique }]) => (
                  <div key={type} className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-700">{resultTypeLabel(type)}</span>
                    <span className="text-gray-500">
                      {total}건
                      <span className="text-[11px] text-[#3E67C8] ml-1">({unique}명)</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Source */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-[14px] font-semibold text-[#2A2475] mb-4">수집 채널</h3>
            {Object.entries(emailsBySource).length === 0 ? (
              <p className="text-[13px] text-gray-400">아직 데이터 없음</p>
            ) : (
              <div className="flex flex-col gap-3">
                {Object.entries(emailsBySource).sort((a, b) => b[1] - a[1]).map(([source, count]) => {
                  const pct = summary.totalEmailSubmissions > 0 ? Math.round((count / summary.totalEmailSubmissions) * 100) : 0;
                  const color = source.includes("kakao") ? "bg-yellow-400" : "bg-[#3E67C8]";
                  return (
                    <div key={source}>
                      <div className="flex justify-between text-[13px] mb-1">
                        <span className="text-gray-700">{SOURCE_LABELS[source] || source}</span>
                        <span className="text-gray-500">{count}건 ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className={`h-2 ${color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-[14px] font-semibold text-[#2A2475] mb-4">퍼널</h3>
          <div className="flex flex-col gap-2">
            {funnelSteps.map((step, i) => {
              const pct = maxFunnel > 0 ? Math.round((step.value / maxFunnel) * 100) : 0;
              const dropoff = i > 0 && funnelSteps[i - 1].value > 0
                ? `${Math.round((step.value / funnelSteps[i - 1].value) * 100)}%`
                : "";
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <span className="text-[13px] text-gray-600 w-[100px] shrink-0">{step.label}</span>
                  <div className="flex-1 h-7 bg-gray-50 rounded relative">
                    <div className="h-7 bg-[#3E67C8] rounded flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max(pct, 2)}%`, opacity: 1 - i * 0.12 }}>
                      {step.value > 0 && <span className="text-[12px] text-white font-medium">{step.value}</span>}
                    </div>
                  </div>
                  <span className="text-[12px] text-gray-400 w-[40px] text-right">{dropoff}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Counts */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-[14px] font-semibold text-[#2A2475] mb-4">전체 이벤트</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(eventCounts).sort((a, b) => b[1] - a[1]).map(([event, count]) => (
              <div key={event} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-[12px] text-gray-600 truncate mr-2">{event}</span>
                <span className="text-[13px] font-semibold text-[#2A2475]">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Journey */}
        <UserJourneyTable users={users} />
      </div>
    </div>
  );
}

// --- User Journey ---

function UserJourneyTable({ users }: { users: GroupedUser[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (email: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-[14px] font-semibold text-[#2A2475] mb-4">
        유저 여정 <span className="text-[12px] font-normal text-gray-400">{users.length}명 (이메일 기준, 클릭하면 세션 상세)</span>
      </h3>
      {users.length === 0 ? (
        <p className="text-[13px] text-gray-400">아직 데이터 없음</p>
      ) : (
        <div className="flex flex-col gap-0">
          {users.map((u) => (
            <UserCard key={u.email} user={u} isOpen={expanded.has(u.email)} onToggle={() => toggle(u.email)} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user: u, isOpen, onToggle }: { user: GroupedUser; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100">
      {/* Summary row */}
      <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 cursor-pointer" onClick={onToggle}>
        <span className={`text-[10px] text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}>&#9654;</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-gray-800 truncate max-w-[200px]">{u.email}</span>
            {u.total_sessions > 1 && <Pill color="blue">{u.total_sessions}회 방문</Pill>}
            {u.ever_shared && <Pill color="orange">공유함</Pill>}
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 flex-wrap">
            {u.latest_nickname && <span>{u.latest_nickname}</span>}
            {u.latest_pathway && <Pill color="purple">{PATHWAY_LABELS[u.latest_pathway] || u.latest_pathway}</Pill>}
            {u.latest_result_type && <span>{resultTypeLabel(u.latest_result_type)}</span>}
            <span>{u.total_events}개 이벤트</span>
            {u.first_seen && <span>첫 방문 {formatDate(u.first_seen)}</span>}
          </div>
        </div>
        <StageBar scores={u.latest_stage_scores} />
      </div>

      {/* Expanded: each session */}
      {isOpen && (
        <div className="pl-6 pb-3 flex flex-col gap-3">
          {u.sessions.map((s, i) => (
            <SessionDetail key={s.session_id || i} session={s} index={i} total={u.sessions.length} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionDetail({ session: s, index, total }: { session: UserSession; index: number; total: number }) {
  const [showEvents, setShowEvents] = useState(false);

  return (
    <div className="bg-[#fafbff] rounded-lg p-4 border border-gray-100">
      {/* Session header */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[12px] font-semibold text-[#2A2475]">
          세션 {index + 1}/{total}
        </span>
        <Pill color={s.source.includes("kakao") ? "yellow" : "blue"}>
          {SOURCE_LABELS[s.source] || s.source}
        </Pill>
        <span className="text-[11px] text-gray-400">{formatDate(s.signed_up_at)}</span>
        {s.nickname && <span className="text-[11px] text-gray-600">닉네임: {s.nickname}</span>}
      </div>

      {/* Test result */}
      {s.stage_scores ? (
        <div className="mb-3">
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            {s.pathway && <Pill color="purple">{PATHWAY_LABELS[s.pathway] || s.pathway}</Pill>}
            {s.result_type && <span className="text-[12px] text-gray-600">{resultTypeLabel(s.result_type)}</span>}
            <Pill color={s.additional_completed ? "green" : "gray"}>
              심화 {s.additional_completed ? "완료" : "미완료"}
            </Pill>
            {s.shared && <Pill color="orange">공유: {s.share_channels.join(", ") || "O"}</Pill>}
          </div>

          {/* Stage scores detail */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {["1", "2", "3", "4", "5"].map((k) => {
              const v = s.stage_scores![k] ?? 0;
              const color = v <= 33 ? "text-red-500" : v <= 60 ? "text-yellow-600" : "text-green-600";
              return (
                <div key={k} className="text-center">
                  <p className="text-[10px] text-gray-400">{STAGE_LABELS[k]}</p>
                  <p className={`text-[14px] font-bold ${color}`}>{v}%</p>
                </div>
              );
            })}
          </div>

          {/* Additional scores */}
          {s.additional_completed && s.additional_scores && (
            <div className="bg-white rounded p-2 mb-2">
              <p className="text-[10px] text-gray-400 mb-1">심화 분석</p>
              <div className="flex gap-3 flex-wrap text-[11px]">
                {Object.entries(s.additional_scores).map(([key, val]) => (
                  <span key={key} className="text-gray-600">
                    <span className="text-gray-400">{key}:</span> {String(val)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-gray-400 mb-2">테스트 결과 없음 (session_id 매칭 실패)</p>
      )}

      {/* Events */}
      <div>
        <button
          onClick={() => setShowEvents(!showEvents)}
          className="text-[11px] text-[#3E67C8] hover:underline"
        >
          {showEvents ? "이벤트 접기" : `이벤트 보기 (${s.event_count}건)`}
        </button>
        {showEvents && s.events.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {s.events.map((ev, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
                <span className="text-gray-300 w-[50px] shrink-0">{formatDate(ev.created_at)}</span>
                <Pill color="gray">{ev.event}</Pill>
                {ev.channel && <span>ch: {ev.channel}</span>}
                {ev.source && <span>src: {ev.source}</span>}
                {ev.program_id && <span>prog: {ev.program_id}</span>}
                {ev.feedback && <span className="text-orange-600 truncate max-w-[200px]">"{ev.feedback}"</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
