export interface InitiationType {
  name: string;
  emoji: string;
  eriksonLink: string;
  description: string;
  signals: string[];
  trainingDirection: string;
  disclaimer?: string;
}

export const initiationTypes: Record<string, InitiationType> = {
  fear: {
    name: "실패 공포형",
    emoji: "\uD83D\uDE30",
    eriksonLink:
      "3단계(주도 vs. 죄책감) — 시도가 비난으로 이어진 경험",
    description:
      "시작하기 전에 '제대로 못하면'이라는 생각이 먼저 와서 행동을 막아요. 완벽주의(회피형)와 깊이 연결되어 있으며, 어린 시절 시도 자체보다 결과가 중시된 환경의 흔적입니다.",
    signals: [
      "시작 전 실패 시나리오를 과도하게 시뮬레이션",
      "부족한 결과를 보이느니 아예 안 하는 선택",
      "다른 사람이 보는 앞에서 새로운 것 시도를 극도로 꺼림",
    ],
    trainingDirection:
      "'최소 행동 시작' — 5분만 해보기 챌린지. 실패해도 안전한 환경 만들기.",
  },
  energy: {
    name: "에너지 고갈형",
    emoji: "\uD83D\uDD0B",
    eriksonLink:
      "4단계(근면 vs. 열등감) — 만성적 과부하 또는 우울의 영향",
    description:
      "하고 싶은 마음은 있지만 몸과 마음이 따라주지 않아요. 아침에 일어나면 할 일의 무게에 압도되는 느낌이 있을 수 있습니다. 만성 스트레스, 번아웃, 또는 우울의 에너지 고갈 상태일 수 있어요.",
    signals: [
      "아침부터 압도감이 밀려옴",
      "할 일 목록만 봐도 지침",
      "주말에도 충분히 회복되지 않음",
      "과거에는 할 수 있었는데 지금은 안 되는 느낌",
    ],
    trainingDirection:
      "에너지 관리 우선 전략. 할 일 줄이기 \u2192 회복 시간 확보 \u2192 작은 성취감 축적.",
  },
  focus: {
    name: "집중 분산형",
    emoji: "\uD83E\uDD8B",
    eriksonLink: "기질적 요인(ADHD 양상) + 불안의 복합",
    description:
      "한 가지에 집중하기 어렵고, 중요한 일 대신 덜 중요한 일을 먼저 하는 패턴이 있을 수 있어요. ADHD 양상일 수도 있고, 중요한 일에 대한 불안이 회피 행동으로 나타나는 것일 수도 있습니다.",
    signals: [
      "하던 일 중 다른 생각에 빠져듦",
      "중요한 일 대신 정리, SNS 등을 하고 있는 자신을 발견",
      "여러 일을 동시에 시작하고 마무리 못 함",
      "집중하려면 엄청난 에너지가 소모됨",
    ],
    trainingDirection:
      "환경 설계(방해 요소 제거) + 포모도로 타이머 + 체크인과 결합한 집중 훈련.",
    disclaimer:
      "집중 어려움이 지속된다면 ADHD 전문 평가를 받아보시는 것을 권합니다. 이 테스트는 ADHD를 진단하지 않습니다.",
  },
};
