-- ============================================
-- COGNIO Supabase Schema
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 이메일 수집 (최우선)
create table if not exists emails (
  id bigint generated always as identity primary key,
  email text not null,
  source text not null default 'result_gate',  -- result_gate, result_gate_kakao, cta_notify 등
  pathway text,            -- perfectionism, attachment, emotion, initiation
  result_type text,        -- "1", "2", "1,2" 등
  additional_completed boolean default false,
  created_at timestamptz default now()
);

-- 이메일 중복 방지 (같은 source에서)
create unique index if not exists emails_email_source_idx on emails (email, source);

-- 2. 테스트 결과 저장
create table if not exists test_results (
  id bigint generated always as identity primary key,
  session_id text not null,           -- 브라우저 세션 식별
  nickname text,
  pathway text not null,
  result_type text not null,
  stage_scores jsonb not null,        -- { "1": 75, "2": 50, ... }
  answers jsonb not null,             -- { "1": 4, "2": 2, ... }
  additional_completed boolean default false,
  additional_answers jsonb,           -- { "P1": 3, "P2": 5, ... }
  additional_scores jsonb,            -- 심화 분석 점수
  unlocked boolean default false,
  created_at timestamptz default now()
);

create index if not exists test_results_pathway_idx on test_results (pathway);
create index if not exists test_results_created_idx on test_results (created_at);

-- 3. 이벤트 트래킹
create table if not exists events (
  id bigint generated always as identity primary key,
  session_id text not null,
  event text not null,                -- email_submit, share_click, rec_click 등
  pathway text,
  result_type text,
  additional_completed boolean,
  program_id text,
  channel text,                       -- instagram, kakao, link_copy, download
  source text,                        -- result_hero, result_gate, cta_notify 등
  email text,
  feedback text,
  value text,
  created_at timestamptz default now()
);

create index if not exists events_event_idx on events (event);
create index if not exists events_session_idx on events (session_id);
create index if not exists events_created_idx on events (created_at);

-- 4. RLS (Row Level Security) 정책
-- anon 사용자가 INSERT만 가능하도록 설정

alter table emails enable row level security;
alter table test_results enable row level security;
alter table events enable row level security;

-- INSERT 허용 (누구나 데이터 제출 가능)
create policy "Allow anonymous insert" on emails for insert with check (true);
create policy "Allow anonymous insert" on test_results for insert with check (true);
create policy "Allow anonymous insert" on events for insert with check (true);

-- SELECT는 service_role key로만 가능 (대시보드/API에서)
-- anon key로는 읽기 불가 → 데이터 보호
