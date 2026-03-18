export interface EmotionType {
  name: string;
  emoji: string;
  eriksonLink: string;
  description: string;
  lowSignals: string[];
  trainingDirection: string;
}

export const emotionTypes: Record<string, EmotionType> = {
  awareness: {
    name: "감정 인식",
    emoji: "\uD83D\uDD0D",
    eriksonLink: "2단계 — 감정 자체를 허용받지 못한 경험",
    description:
      "감정이 올라와도 그것이 어떤 감정인지 구분하기 어려울 수 있어요. 어린 시절 감정을 이름 붙이고 이해하는 연습이 부족했거나, '감정적이다'는 것이 부정적으로 여겨졌던 환경의 영향일 수 있습니다.",
    lowSignals: [
      "막연한 불쾌감은 느끼지만 뭔지 모름",
      "감정을 '좋다/나쁘다'로만 분류",
      "몸의 신호(두통, 위장, 근육 긴장)로 감정이 표현됨",
    ],
    trainingDirection:
      "감정 어휘 확장 훈련. 매일 체크인에서 세분화된 감정 이름을 선택하는 연습부터 시작.",
  },
  acceptance: {
    name: "감정 수용",
    emoji: "\uD83E\uDD32",
    eriksonLink:
      "2단계 — '이런 감정을 느끼면 안 돼'라는 메시지를 받은 경험",
    description:
      "감정이 올라오면 '이런 감정을 느끼는 내가 문제'라고 느낄 수 있어요. 화, 슬픔, 불안 같은 감정을 느끼는 것 자체에 수치심이나 죄책감이 따라오는 패턴입니다.",
    lowSignals: [
      "부정적 감정을 느끼면 자책함",
      "'이렇게 느끼면 안 되는데'가 자동 반응",
      "감정을 억누르다가 어느 순간 폭발하는 패턴",
    ],
    trainingDirection:
      "감정 자기연민 훈련. '이 감정을 느끼는 것은 자연스럽다'를 매일 반복하는 연습.",
  },
  strategy: {
    name: "감정 대처",
    emoji: "\uD83E\uDDF0",
    eriksonLink:
      "3단계 — 감정에 대한 건강한 대처법을 배우지 못한 경험",
    description:
      "감정이 격해졌을 때 어떻게 해야 할지 몰라서 얼어붙거나, 폭발하거나, 부적절한 방법에 의존할 수 있어요. 건강한 감정 대처 전략은 성인이 되어서도 배울 수 있는 기술이에요.",
    lowSignals: [
      "감정 격해지면 얼어붙음(freeze) 또는 폭발",
      "사소한 일에 과도하게 반응하는 패턴",
      "스트레스 상황에서 충동적 행동",
      "감정 대처로 회피 행동(과식, SNS, 과도한 수면)",
    ],
    trainingDirection:
      "구체적인 감정 대처 기술 학습. 그라운딩, 호흡 기법, 감정 명명하기, 나만의 안전 공간 만들기.",
  },
};
