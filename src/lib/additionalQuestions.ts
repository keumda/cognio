export interface AdditionalQuestion {
  id: string;
  subtype: string;
  text: string;
  direction: "positive" | "negative";
}

export const additionalQuestions: Record<string, AdditionalQuestion[]> = {
  perfectionism: [
    {
      id: "P1",
      subtype: "shame",
      text: "실수한 후 자꾸 그 장면이 떠오르고, 부끄러움이 오래 간다.",
      direction: "negative",
    },
    {
      id: "P2",
      subtype: "avoidance",
      text: "결과가 완벽하지 않을 것 같으면, 아예 시작하지 않는 편이다.",
      direction: "negative",
    },
    {
      id: "P3",
      subtype: "proving",
      text: "잘해내야 인정받을 수 있다고 느끼고, 쉬는 것에 죄책감을 느낀다.",
      direction: "negative",
    },
    {
      id: "P4",
      subtype: "shame",
      text: "누군가에게 부족한 모습을 보이는 것이 매우 불편하다.",
      direction: "negative",
    },
    {
      id: "P5",
      subtype: "avoidance",
      text: "완벽한 계획을 세우는 데 시간을 많이 쓰지만, 실행으로 넘어가기 어렵다.",
      direction: "negative",
    },
    {
      id: "P6",
      subtype: "proving",
      text: "성취를 해도 '이 정도로는 부족하다'는 생각이 자주 든다.",
      direction: "negative",
    },
  ],

  attachment: [
    {
      id: "A1",
      subtype: "anxiety",
      text: "가까운 사람이 나를 떠날까 봐 불안할 때가 많다.",
      direction: "negative",
    },
    {
      id: "A2",
      subtype: "avoidance",
      text: "나는 다른 사람에게 마음을 여는 것이 편하다.",
      direction: "positive",
    },
    {
      id: "A3",
      subtype: "anxiety",
      text: "연인이나 가까운 친구가 나를 진심으로 좋아하는지 자주 확인하고 싶다.",
      direction: "negative",
    },
    {
      id: "A4",
      subtype: "avoidance",
      text: "누군가에게 의지하는 것이 불편하다.",
      direction: "negative",
    },
    {
      id: "A5",
      subtype: "anxiety",
      text: "관계에서 버림받을까 봐 두려운 마음이 크다.",
      direction: "negative",
    },
    {
      id: "A6",
      subtype: "avoidance",
      text: "감정적으로 깊이 연결되는 것보다 적당한 거리를 유지하는 게 편하다.",
      direction: "negative",
    },
  ],

  emotion: [
    {
      id: "E1",
      subtype: "awareness",
      text: "감정이 올라와도 그게 어떤 감정인지 잘 모를 때가 많다.",
      direction: "negative",
    },
    {
      id: "E2",
      subtype: "acceptance",
      text: "부정적인 감정이 올라오면, 이런 감정을 느끼는 내가 싫어진다.",
      direction: "negative",
    },
    {
      id: "E3",
      subtype: "strategy",
      text: "감정이 격해지면 어떻게 해야 할지 몰라서 얼어붙거나 폭발한다.",
      direction: "negative",
    },
    {
      id: "E4",
      subtype: "awareness",
      text: "지금 내가 느끼는 감정에 이름을 붙이는 것이 비교적 쉽다.",
      direction: "positive",
    },
    {
      id: "E5",
      subtype: "acceptance",
      text: "슬프거나 화가 나는 것도 자연스러운 감정이라고 받아들일 수 있다.",
      direction: "positive",
    },
    {
      id: "E6",
      subtype: "strategy",
      text: "힘든 감정이 올라와도, 나만의 대처 방법이 있는 편이다.",
      direction: "positive",
    },
  ],

  initiation: [
    {
      id: "I1",
      subtype: "fear",
      text: "시작하기 전에 '이걸 제대로 못하면 어쩌지'라는 생각이 먼저 든다.",
      direction: "negative",
    },
    {
      id: "I2",
      subtype: "energy",
      text: "하고 싶은 마음은 있는데, 몸이 따라주지 않는 느낌이 자주 든다.",
      direction: "negative",
    },
    {
      id: "I3",
      subtype: "focus",
      text: "한 가지 일을 하다가 다른 생각이 끼어들어서 자꾸 흐름이 끊긴다.",
      direction: "negative",
    },
    {
      id: "I4",
      subtype: "fear",
      text: "다른 사람이 보기에 부족한 결과를 내느니 차라리 안 하는 게 낫다고 느낀다.",
      direction: "negative",
    },
    {
      id: "I5",
      subtype: "energy",
      text: "아침에 일어나서 오늘 할 일을 생각하면 압도되는 느낌이 든다.",
      direction: "negative",
    },
    {
      id: "I6",
      subtype: "focus",
      text: "중요한 일이 있는데도, 덜 중요한 일을 먼저 하고 있는 자신을 자주 발견한다.",
      direction: "negative",
    },
  ],
};

export const pathwayLabels: Record<string, string> = {
  perfectionism: "완벽주의 패턴",
  attachment: "관계와 애착 패턴",
  emotion: "감정조절 패턴",
  initiation: "시작과 실행 패턴",
};
