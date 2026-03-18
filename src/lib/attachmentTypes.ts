export interface AttachmentType {
  name: string;
  nameEn: string;
  emoji: string;
  eriksonLink: string;
  description: string;
  inRelationship: string[];
  growthArea: string;
}

export const attachmentTypes: Record<string, AttachmentType> = {
  secure: {
    name: "안정형",
    nameEn: "Secure",
    emoji: "\uD83D\uDC9A",
    eriksonLink: "1단계(신뢰)가 잘 형성됨",
    description:
      "관계에서 비교적 편안하고, 가까워지는 것도 거리를 두는 것도 자연스러워요. 초기 양육자와의 관계에서 일관된 돌봄을 받은 경험이 이 안정감의 토대입니다.",
    inRelationship: [
      "갈등 후 회복이 가능함",
      "도움 요청이 자연스러움",
      "혼자만의 시간도 편안함",
      "상대의 독립성을 존중할 수 있음",
    ],
    growthArea:
      "안정형이어도 특정 상황에서는 불안이나 회피가 활성화될 수 있어요. 자신의 패턴을 인식하고 있는 것 자체가 강력한 자원입니다.",
  },
  anxious: {
    name: "불안형",
    nameEn: "Anxious-Preoccupied",
    emoji: "\uD83D\uDC9B",
    eriksonLink:
      "1단계(신뢰)의 부분적 미해결 — 돌봄이 불안정했을 가능성",
    description:
      "관계에서 '이 사람이 나를 진짜 좋아하는 걸까?'라는 확인 욕구가 강하고, 거리가 벌어지면 불안이 올라와요. 초기 양육자의 반응이 때로는 따뜻하고 때로는 부재했던 경험이 이 패턴을 만들었을 수 있습니다.",
    inRelationship: [
      "상대의 반응에 예민함",
      "확인/확답을 자주 구함",
      "혼자 있으면 불안함",
      "관계에 과도하게 몰입하는 경향",
    ],
    growthArea:
      "불안이 올라올 때 '지금 이것은 과거의 패턴이 작동하는 것일 수 있다'고 인식하는 연습이 첫 걸음이에요. 자기 안정화 기술을 먼저 키운 후, 타인과의 소통으로 나아갈 수 있습니다.",
  },
  dismissive: {
    name: "회피형",
    nameEn: "Dismissive-Avoidant",
    emoji: "\uD83D\uDD35",
    eriksonLink:
      "1단계(신뢰)의 미해결 — 돌봄 자체가 부족했을 가능성",
    description:
      "깊은 감정적 연결보다 독립성을 중시하고, 누군가에게 의지하는 것이 불편해요. 이것은 '어차피 기대하면 실망한다'는 초기 경험이 만든 자기보호 전략일 수 있습니다.",
    inRelationship: [
      "친밀함이 깊어지면 거리를 둠",
      "감정 표현이 어렵거나 꺼림",
      "'나는 혼자가 편해'라는 말이 익숙함",
      "상대가 요구하면 부담스러움",
    ],
    growthArea:
      "회피가 '약함'이 아니라 '보호'였다는 것을 이해하는 것에서 시작해요. 작은 취약함을 안전한 사람에게 보여주는 연습을 아주 천천히 해볼 수 있습니다.",
  },
  fearful: {
    name: "혼란형",
    nameEn: "Fearful-Avoidant",
    emoji: "\uD83D\uDFE3",
    eriksonLink:
      "1단계(신뢰)의 심각한 미해결 — 돌봄자 자체가 공포의 원천이었을 가능성",
    description:
      "가까워지고 싶지만 가까워지면 두렵고, 거리를 두면 외로운 — 모순된 감정이 동시에 올라와요. 이것은 안전을 주어야 할 사람이 동시에 불안의 원천이었던 경험에서 오는 가장 복잡한 애착 패턴입니다.",
    inRelationship: [
      "밀당 패턴의 반복",
      "극단적 친밀감 \u2194 극단적 거리두기",
      "관계 자체에 대한 두려움",
      "상대를 떠나보내거나 밀어내는 반복",
    ],
    growthArea:
      "이 패턴은 혼자 다루기 가장 어려운 유형이에요. 전문 상담을 병행하는 것을 강하게 권합니다. 우선은 자기 패턴을 '인식'하는 것 자체가 매우 큰 첫 걸음입니다.",
  },
};
