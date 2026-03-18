/**
 * ── Cognio 코스 시스템 ──
 *
 * Duolingo/Brilliant 모델:
 * - 코스 = 하나의 주제 (완벽주의, 애착, 감정조절 등)
 * - 레슨 = 매일 5분 마이크로 학습 단위
 * - 레벨 = 코스 내 난이도 단계
 *
 * Fake Door 검증 포인트:
 * - 어떤 코스에 가장 많은 waitlist 신청이 들어오는가
 * - pathway별로 추천 코스 전환율이 다른가
 * - 코스 수요 순위 = 실제 앱 론칭 시 우선개발 순서
 */

import { AdditionalScores } from "./additionalScoring";

export interface TestResult {
  stages: number[];
  pathway: string;
  additionalCompleted: boolean;
  additionalScores?: AdditionalScores;
}

export interface Course {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  lessonCount: number;
  minutesPerDay: number;
  topics: string[];
  condition: (result: TestResult) => boolean;
}

export const courses: Course[] = [
  {
    id: "perfectionism",
    emoji: "\uD83C\uDFAF",
    title: "완벽주의 해제",
    subtitle: "충분히 좋은 것도 괜찮다는 감각 키우기",
    lessonCount: 28,
    minutesPerDay: 5,
    topics: ["수치심 다루기", "80% 시작법", "자기연민 훈련", "비교 멈추기"],
    condition: (r) =>
      r.stages[1] < 50 ||
      r.pathway === "perfectionism" ||
      (r.additionalCompleted && r.additionalScores?.primaryType === "shame"),
  },
  {
    id: "initiative",
    emoji: "\uD83D\uDE80",
    title: "시작의 기술",
    subtitle: "5분짜리 시작을 반복하는 실행력 훈련",
    lessonCount: 21,
    minutesPerDay: 5,
    topics: ["최소 행동 설계", "실패 내성 키우기", "포모도로 습관", "회피 패턴 인식"],
    condition: (r) =>
      r.stages[2] < 50 || r.pathway === "initiation",
  },
  {
    id: "emotion",
    emoji: "\uD83C\uDF0A",
    title: "감정 리터러시",
    subtitle: "감정을 읽고, 수용하고, 다루는 기초 체력",
    lessonCount: 21,
    minutesPerDay: 5,
    topics: ["감정 이름 붙이기", "바디스캔", "그라운딩 기법", "감정 일기"],
    condition: (r) =>
      r.pathway === "emotion" ||
      (r.additionalCompleted && r.additionalScores?.weakestArea !== undefined),
  },
  {
    id: "attachment",
    emoji: "\uD83D\uDD17",
    title: "관계 패턴 리셋",
    subtitle: "반복되는 관계 패턴의 뿌리 이해하기",
    lessonCount: 28,
    minutesPerDay: 5,
    topics: ["애착 유형 이해", "경계 설정", "안전한 취약함", "관계 안 자기돌봄"],
    condition: (r) =>
      r.stages[0] < 50 ||
      r.pathway === "attachment",
  },
  {
    id: "identity",
    emoji: "\uD83E\uDDED",
    title: "나를 찾는 여정",
    subtitle: "역할을 빼고 남는 '나'를 탐색하기",
    lessonCount: 21,
    minutesPerDay: 5,
    topics: ["가치관 탐색", "Future Authoring", "역할 vs 정체성", "나만의 서사 쓰기"],
    condition: (r) => r.stages[4] < 50,
  },
  {
    id: "burnout",
    emoji: "\uD83D\uDD0B",
    title: "번아웃 리커버리",
    subtitle: "에너지를 회복하고 지속가능한 루틴 만들기",
    lessonCount: 14,
    minutesPerDay: 5,
    topics: ["에너지 감사", "할 일 줄이기", "회복 루틴", "경계 세우기"],
    condition: (r) =>
      r.stages[3] < 50 ||
      (r.additionalCompleted && r.additionalScores?.primaryChallenge === "energy"),
  },
];
