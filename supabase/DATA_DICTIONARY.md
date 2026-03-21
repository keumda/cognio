# COGNIO Data Dictionary

Supabase 테이블 구조 및 데이터 흐름 정리.
3개 테이블 모두 `session_id`로 JOIN 가능.

---

## 1. emails

이메일 수집. 결과 잠금 해제 시 저장.

| 컬럼 | 타입 | 설명 | 예시 |
|---|---|---|---|
| `id` | bigint (PK) | 자동 증가 | 1 |
| `session_id` | text | 브라우저 탭별 UUID (3개 테이블 공통 키) | `abc-111-def` |
| `email` | text | 유저 입력 이메일 또는 `kakao_channel` | `user@gmail.com` |
| `source` | text | 제출 경로 | `result_gate`, `result_gate_kakao` |
| `pathway` | text | 유저가 선택한 경로 | `perfectionism`, `attachment`, `emotion`, `initiation` |
| `result_type` | text | 5단계 점수 기반 유형 | `"1"`, `"2,3"` |
| `additional_completed` | boolean | 추가 6문항 완료 여부 | `true` |
| `created_at` | timestamptz | 자동 (Supabase now()) | `2026-03-21T09:00:00Z` |

### 저장 시점 (ResultScreen)

| 트리거 | email 값 | source 값 |
|---|---|---|
| "이메일로 받기" 클릭 | 유저 입력값 | `result_gate` |
| "카카오톡 알림 받기" 클릭 | `kakao_channel` | `result_gate_kakao` |

- 같은 이메일 재제출 허용 (세션별 저장)
- 유니크 유저 수는 stats API에서 `uniqueEmails`로 제공

---

## 2. test_results

테스트 완료 시 결과 화면 진입과 동시에 저장 (1세션 1회).

| 컬럼 | 타입 | 설명 | 예시 |
|---|---|---|---|
| `id` | bigint (PK) | 자동 증가 | 1 |
| `session_id` | text | 브라우저 탭별 UUID | `abc-111-def` |
| `nickname` | text | 유저 입력 닉네임 | `민지` |
| `pathway` | text | 선택 경로 | `emotion` |
| `result_type` | text | 유형 키 | `"2,3"` |
| `stage_scores` | jsonb | 5단계 퍼센티지 | `{"1": 75, "2": 33, "3": 33, "4": 50, "5": 67}` |
| `answers` | jsonb | 15문항 응답 (1~5) | `{"1": 4, "2": 2, ...}` |
| `additional_completed` | boolean | 추가 문항 완료 여부 | `true` |
| `additional_answers` | jsonb | 추가 6문항 응답 | `{"E1": 3, "E2": 5, ...}` |
| `additional_scores` | jsonb | 심화 분석 점수 | `{"strategy": 6, "awareness": 8, ...}` |
| `unlocked` | boolean | 결과 잠금 해제 여부 | `false` |
| `created_at` | timestamptz | 자동 | `2026-03-21T09:00:00Z` |

### 저장 시점

ResultScreen 마운트 시 **1회만** 저장 (`resultSaved` state로 중복 방지).
잠금 해제 **이전**에 저장되므로 `unlocked`는 저장 시점에 항상 `false`.

### 컬럼별 데이터 출처

#### session_id
- `getSessionId()` → `crypto.randomUUID()`
- 브라우저 탭의 sessionStorage에 저장, 탭 닫으면 소멸

#### nickname
- 닉네임 입력 화면(NicknameScreen)에서 유저가 입력
- 미입력 시 `null`
- 공유 URL의 `?n=` 파라미터로 전달되기도 함

#### pathway
- PathScreen에서 유저가 4가지 중 선택:
  - `perfectionism` — 완벽주의 패턴
  - `attachment` — 애착 패턴
  - `emotion` — 감정 조절 패턴
  - `initiation` — 시작/주도성 패턴

#### result_type
- `getResultType()` 함수에서 계산
- 5단계 퍼센티지 중 가장 낮은 단계를 기반으로 결정:
  1. 5단계 각각의 퍼센티지 계산 (0~100%)
  2. 가장 낮은 단계 = `lowest`
  3. 두 번째로 낮은 단계(`secondLowest`)도 50% 이하이고, 두 단계 조합이 `["1,2", "1,3", "2,3", "2,4", "3,4"]`에 해당하면 → 콤보 (예: `"1,2"`)
  4. 아니면 → 단일 (예: `"3"`)
- 가능한 값: `"1"`, `"2"`, `"3"`, `"4"`, `"5"`, `"1,2"`, `"1,3"`, `"2,3"`, `"2,4"`, `"3,4"`

#### stage_scores
- `getStagePercentages()` 결과
- 각 단계별 3문항의 응답을 합산 → 퍼센티지로 변환
- 계산: `Math.round(((합산점수 - 3) / 12) * 100)`
- 예: `{"1": 75, "2": 33, "3": 50, "4": 42, "5": 67}`

#### answers
- 15문항 핵심 질문 응답 (1~5 리커트 척도)
- 키: 문항 번호 (1~15), 값: 응답값 (1=전혀 아니다 ~ 5=매우 그렇다)
- 예: `{"1": 4, "2": 2, "3": 5, "4": 1, ...}`

#### additional_completed
- 경로별 추가 6문항을 끝까지 답했는지 여부
- TransitionScreen에서 "건너뛰기" 선택 시 `false`

#### additional_answers
- `additional_completed`가 `true`일 때만 저장, 아니면 `null`
- 키: 경로 접두사 + 문항번호, 값: 1~5
- 경로별 접두사: `P`(perfectionism), `A`(attachment), `E`(emotion), `I`(initiation)
- 예: `{"E1": 3, "E2": 5, "E3": 2, "E4": 4, "E5": 1, "E6": 3}`

#### additional_scores
- `additional_completed`가 `true`일 때만 저장, 아니면 `null`
- `scoreAdditional()` 함수에서 경로별로 다른 구조 반환:

**perfectionism:**
| 필드 | 설명 | 범위 |
|---|---|---|
| `shame` | 수치심형 완벽주의 점수 | 2~10 |
| `avoidance` | 회피형 완벽주의 점수 | 2~10 |
| `proving` | 증명형 완벽주의 점수 | 2~10 |
| `primaryType` | 가장 높은 유형 | `"shame"` / `"avoidance"` / `"proving"` |

**attachment:**
| 필드 | 설명 | 범위 |
|---|---|---|
| `anxiety` | 불안 축 점수 | 3~15 |
| `avoidanceAxis` | 회피 축 점수 | 3~15 |
| `attachmentType` | 애착 유형 | `"secure"` / `"anxious"` / `"dismissive"` / `"fearful"` |

**emotion:**
| 필드 | 설명 | 범위 |
|---|---|---|
| `awareness` | 감정 인식 점수 | 2~10 |
| `acceptance` | 감정 수용 점수 | 2~10 |
| `strategy` | 감정 조절 전략 점수 | 2~10 |
| `weakestArea` | 가장 낮은 영역 | `"awareness"` / `"acceptance"` / `"strategy"` |

**initiation:**
| 필드 | 설명 | 범위 |
|---|---|---|
| `fear` | 실패 공포 점수 | 2~10 |
| `energy` | 에너지/동기 점수 | 2~10 |
| `focus` | 집중/방향 점수 | 2~10 |
| `primaryChallenge` | 가장 높은 어려움 | `"fear"` / `"energy"` / `"focus"` |

#### unlocked
- 결과 잠금 해제 여부
- 저장 시점(ResultScreen 마운트)에서는 항상 `false`
- 이후 이메일/카카오로 해제해도 DB의 이 값은 업데이트되지 않음 (emails 테이블에서 확인)

---

## 3. events

모든 유저 인터랙션 트래킹. `track()` 호출 시마다 저장.

| 컬럼 | 타입 | 설명 | 사용하는 이벤트 |
|---|---|---|---|
| `id` | bigint (PK) | 자동 증가 | 전체 |
| `session_id` | text | 브라우저 탭별 UUID | 전체 |
| `event` | text | 이벤트명 | 전체 |
| `pathway` | text | 선택 경로 | 대부분 |
| `result_type` | text | 유형 키 | email_submit, cta_* |
| `additional_completed` | boolean | 추가 문항 완료 | email_submit, cta_* |
| `program_id` | text | 추천 코스 ID | course_impression, course_notify |
| `channel` | text | 공유 채널 | share_click |
| `source` | text | 이메일 제출 경로 | email_submit |
| `email` | text | 유저 이메일 | email_submit, course_notify |
| `feedback` | text | 유저 피드백 텍스트 | feedback_submit |
| `value` | text | 범용 (현재 미사용) | - |
| `created_at` | timestamptz | 자동 | 전체 |

### 이벤트 목록

#### ResultScreen

| event | 트리거 | 채워지는 컬럼 |
|---|---|---|
| `email_submit` | 이메일 입력 후 잠금 해제 | `source`=`result_gate`, `email`, `pathway`, `resultType`, `additionalCompleted` |
| `email_submit` | 카카오 버튼으로 잠금 해제 | `source`=`result_gate_kakao`, `pathway`, `resultType`, `additionalCompleted` |
| `share_click` | "결과 카드 만들기" 클릭 | `channel`=`card`, `pathway` |
| `share_click` | "내 결과 공유하기" 클릭 | `channel`=`link_copy`, `pathway` |
| `cta_explore_click` | "Cognio 앱 자세히 알아보기" 클릭 | `pathway`, `resultType`, `additionalCompleted` |

#### RecommendationCards

| event | 트리거 | 채워지는 컬럼 |
|---|---|---|
| `course_impression` | 추천 카드 영역 스크롤 도달 | `pathway` |
| `course_notify` | 추천 코스 "알림 받기" 클릭 | `programId`, `email` |
| `course_list_opened` | 전체 코스 리스트 펼치기 | `pathway` |

#### ConnectionInsight

| event | 트리거 | 채워지는 컬럼 |
|---|---|---|
| `course_notify` | 연결 인사이트 "알림 받기" 클릭 | `email` |

#### CTAScreen

| event | 트리거 | 채워지는 컬럼 |
|---|---|---|
| `cta_page_view` | CTA 페이지 진입 | `pathway`, `resultType`, `additionalCompleted` |
| `{planId}_interest` | 요금제 클릭 | `pathway`, `resultType`, `additionalCompleted` |
| `kakao_channel_click` | 카카오 채널 클릭 | `pathway`, `resultType`, `additionalCompleted` |
| `feedback_submit` | 피드백 제출 | `feedback`, `pathway`, `resultType`, `additionalCompleted` |

---

## 퍼널 분석 가이드

```
테스트 완료 (test_results)
  ↓
결과 확인 → 잠금 해제 (email_submit)
  ↓
심화 분석 확인 → 추천 코스 (course_impression → course_notify)
  ↓
공유 (share_click) / 앱 탐색 (cta_explore_click)
  ↓
CTA 페이지 (cta_page_view → {plan}_interest / kakao_channel_click)
```

### 핵심 전환율

| 지표 | 계산 |
|---|---|
| 테스트 → 이메일 전환율 | `uniqueEmails / totalTestCompleted` |
| 이메일 → 공유 전환율 | `share_click 유저 / email_submit 유저` (session_id 기준) |
| 이메일 → CTA 전환율 | `cta_explore_click 유저 / email_submit 유저` |
| CTA → 요금제 관심 | `{plan}_interest 유저 / cta_page_view 유저` |

---

## RLS 정책

- `anon` key: INSERT만 가능 (데이터 제출)
- `service_role` key: 전체 접근 (stats API, 대시보드)
- SELECT는 anon key로 불가 → 유저 데이터 보호

## 테이블 연결

```sql
-- 이메일 제출한 유저의 전체 여정 조회
select
  e.email, e.source, e.created_at as signed_up_at,
  r.nickname, r.pathway, r.result_type, r.stage_scores,
  count(ev.id) as event_count
from emails e
left join test_results r on r.session_id = e.session_id
left join events ev on ev.session_id = e.session_id
group by e.id, r.id;
```
