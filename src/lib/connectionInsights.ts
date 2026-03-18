export interface ConnectionInsightData {
  title: string;
  insight: string;
  breakingPoint: string; // 순수 인사이트 텍스트 (코스명 제외)
  courseIds: string[];
}

export const connectionInsights: Record<string, ConnectionInsightData> = {
  "1,2": {
    title: "신뢰 부족 \u2192 수치심 강화",
    insight:
      "기본적 신뢰가 약하면(1단계), 자율성을 시도할 때 '실패하면 아무도 도와주지 않는다'는 공포가 생기면서 수치심이 더 강해질 수 있어요. 이 두 단계는 서로를 강화하는 악순환을 만들 수 있습니다.",
    breakingPoint:
      "안전한 관계 안에서 작은 취약함을 보여주는 훈련이 두 단계를 동시에 회복시킬 수 있어요.",
    courseIds: ["attachment", "perfectionism"],
  },
  "1,3": {
    title: "신뢰 부족 \u2192 안전한 시작 불가",
    insight:
      "세상이 안전하지 않다고 느끼면(1단계), 무언가를 시작하는 것 자체가 위험으로 느껴져요(3단계). '실패하면 아무도 받아주지 않을 것이다'라는 복합적 공포입니다.",
    breakingPoint:
      "혼자가 아니라 '함께하는 시작'이 안전감을 만듭니다. 신뢰를 먼저 키우고, 작은 실행을 반복해보세요.",
    courseIds: ["attachment", "initiative"],
  },
  "1,5": {
    title: "신뢰 부족 \u2192 정체성 불안정",
    insight:
      "기본적 신뢰가 약하면(1단계), 관계 속에서 자기를 탐색하는 것이 어려워져요. 타인과의 안전한 연결 없이 정체성을 형성하기는 매우 어렵기 때문에 5단계도 영향을 받습니다.",
    breakingPoint:
      "안전한 관계를 먼저 구축하는 것이 전제 조건이에요. 관계 안정감을 토대로 나를 탐색해보세요.",
    courseIds: ["attachment", "identity"],
  },
  "2,3": {
    title: "수치심 \u2192 시작 불능",
    insight:
      "수치심이 강하면(2단계), 새로운 것을 시작할 때 '못하면 부끄러울 것 같다'는 공포가 발목을 잡아요(3단계). 미루기의 가장 깊은 뿌리가 종종 여기에 있습니다.",
    breakingPoint:
      "결과와 무관하게 시도 자체를 인정하는 연습이 핵심이에요. 완벽하지 않아도 일단 시작하고, 실패해도 안전한 환경을 만들어보세요.",
    courseIds: ["perfectionism", "initiative"],
  },
  "2,4": {
    title: "수치심 + 열등감 = 완벽주의의 감옥",
    insight:
      "수치심(2단계)과 열등감(4단계)이 함께 작동하면 '완벽하지 않으면 나는 가치 없다'는 가장 강력한 완벽주의 패턴이 만들어져요. 끊임없이 증명하면서도 늘 부족하다고 느끼는 이 패턴은 번아웃의 핵심 원인입니다.",
    breakingPoint:
      "성과가 아닌 존재 자체로 괜찮다는 경험이 시작점이에요. 수치심을 먼저 다루고, 압박을 줄여보세요.",
    courseIds: ["perfectionism", "burnout"],
  },
  "3,4": {
    title: "시작 불능 + 성취 압박 = 만성 스트레스",
    insight:
      "해내야 한다는 압박(4단계)과 시작할 수 없는 막막함(3단계)이 동시에 오면 가장 큰 내적 갈등이 생겨요. '해야 하는데 못 하겠다'는 자기 비난의 루프입니다.",
    breakingPoint:
      "압박을 줄이면서 시작을 쉽게 만드는 것이 핵심이에요. 5분짜리 시작을 반복하고, 할 일 목록을 반으로 줄여보세요.",
    courseIds: ["initiative", "burnout"],
  },
  "4,5": {
    title: "성취 의존 \u2192 정체성 공허",
    insight:
      "성과로만 자기 가치를 증명해온 사람(4단계)은 '성과를 빼면 나는 누구인가?'라는 정체성 혼란(5단계)에 빠지기 쉬워요. 번아웃이 올 때 공허함이 극심해지는 이유입니다.",
    breakingPoint:
      "'내가 하는 것'이 아닌 '내가 되고 싶은 것'을 탐색하는 게 시작이에요. 가치관 중심의 서사를 다시 써보세요.",
    courseIds: ["identity", "burnout"],
  },
};
