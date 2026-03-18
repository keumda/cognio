export interface PerfectionismType {
  name: string;
  emoji: string;
  tagline: string;
  eriksonLink: string;
  eriksonStage: number;
  description: string;
  coreBeliefs: string[];
  dailyPatterns: string[];
  rewriteDirection: string;
}

export const perfectionismTypes: Record<string, PerfectionismType> = {
  shame: {
    name: "수치심형 완벽주의",
    emoji: "\uD83D\uDEE1\uFE0F",
    tagline: '"부족한 나를 들키면 안 돼"',
    eriksonLink: "2단계(자율 vs. 수치심)의 미해결",
    eriksonStage: 2,
    description:
      "'실수 = 나는 부족한 사람'이라는 등식이 내면에 자리잡고 있어요. 완벽하지 않은 모습을 보이는 것 자체가 수치심을 촉발합니다. 이 유형의 완벽주의는 어린 시절 실수가 비난이나 수치심으로 이어진 경험에서 형성됩니다.",
    coreBeliefs: [
      "나는 부족한 사람이다",
      "실수하면 사랑받지 못한다",
      "약한 모습을 보이면 안 된다",
    ],
    dailyPatterns: [
      "실수 후 반추 — 그 장면이 머릿속에서 계속 재생됨",
      "완벽하지 않으면 아예 안 보여줌",
      "칭찬받으면 오히려 불편하거나 믿지 못함",
      "혼자 있을 때만 진짜 안심이 됨",
    ],
    rewriteDirection:
      "수치심을 자기연민으로 천천히 대체하는 훈련. '부족한 나'가 아니라 '성장 중인 나'로 서사를 다시 쓰기.",
  },
  avoidance: {
    name: "회피형 완벽주의",
    emoji: "\u23F8\uFE0F",
    tagline: '"못하느니 안 하는 게 낫지"',
    eriksonLink: "3단계(주도 vs. 죄책감)의 미해결",
    eriksonStage: 3,
    description:
      "'완벽하게 할 수 없으면 시작하지 않겠다'는 패턴이에요. 끝없이 계획을 세우지만 실행으로 넘어가지 못하거나, 마감 직전에야 시작합니다. 이것은 게으름이 아니라, 실패에 대한 깊은 공포가 만든 보호 전략입니다.",
    coreBeliefs: [
      "시작하면 실패할 것이다",
      "준비가 완벽해야 시작할 수 있다",
      "못하느니 안 하는 게 낫다",
    ],
    dailyPatterns: [
      "계획만 세우고 실행으로 넘어가지 못함",
      "마감 직전 벼락치기",
      "새로운 것 시작이 극도로 어려움",
      "시작 전 정보/자료를 끝없이 모으는 패턴",
    ],
    rewriteDirection:
      "'완벽한 시작'이 아닌 '충분히 좋은 시작'의 경험을 반복. 의도적으로 80%짜리 결과물을 내는 연습.",
  },
  proving: {
    name: "증명형 완벽주의",
    emoji: "\uD83C\uDFCB\uFE0F",
    tagline: '"더 해야 해, 이 정도론 부족해"',
    eriksonLink: "4단계(근면 vs. 열등감)의 미해결",
    eriksonStage: 4,
    description:
      "끊임없이 성과를 내야 한다는 압박이 있어요. 쉬면 뒤처지는 것 같고, 성취해도 '더 해야 한다'는 느낌이 빠지지 않습니다. 이것은 어린 시절 '결과'로만 사랑이나 인정을 받은 경험의 흔적입니다.",
    coreBeliefs: [
      "결과로만 내 가치가 증명된다",
      "쉬면 뒤처진다",
      "이 정도로는 부족하다",
    ],
    dailyPatterns: [
      "쉬는 것에 죄책감을 느낌",
      "끊임없이 타인과 비교",
      "성취 후에도 공허함이나 불만족",
      "일이 없으면 불안해서 뭐라도 함",
    ],
    rewriteDirection:
      "'무엇을 해냈는가'가 아닌 '어떻게 살고 싶은가'로 자기 서사의 중심축 이동. 성과 없이도 괜찮은 나를 경험하기.",
  },
};
