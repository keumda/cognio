-- emails 테이블에 session_id 추가 (3개 테이블 공통 키)
alter table emails add column if not exists session_id text;
create index if not exists emails_session_idx on emails (session_id);
