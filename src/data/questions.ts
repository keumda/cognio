export interface Question {
  id: number;
  stage: number;
  text: string;
  direction: "positive" | "negative";
}

export const questions: Question[] = [
  { id: 1, stage: 1, text: "어려운 일이 생겼을 때, 주변 사람에게 도움을 요청하는 것이 자연스럽다.", direction: "positive" },
  { id: 2, stage: 1, text: "누군가 나에게 친절하면, 뭔가 원하는 게 있는 건 아닌지 먼저 의심이 든다.", direction: "negative" },
  { id: 3, stage: 1, text: "혼자서는 해결할 수 없는 일이 있어도, 결국에는 괜찮아질 거라고 느낀다.", direction: "positive" },
  { id: 4, stage: 2, text: "실수를 했을 때, 그 일보다는 '내가 부족해서 그렇다'는 생각이 먼저 든다.", direction: "negative" },
  { id: 5, stage: 2, text: "다른 사람의 기대와 다른 선택을 할 때에도 크게 불안하지 않다.", direction: "positive" },
  { id: 6, stage: 2, text: "누군가 앞에서 실수하면, 그 사람을 다시 만나기가 어렵다.", direction: "negative" },
  { id: 7, stage: 3, text: "새로운 일을 시작하려 할 때, '잘 못하면 어쩌지'라는 생각에 막히는 경우가 많다.", direction: "negative" },
  { id: 8, stage: 3, text: "하고 싶은 일이 있으면, 완벽한 준비가 되지 않아도 일단 시작하는 편이다.", direction: "positive" },
  { id: 9, stage: 3, text: "무언가를 시도했다가 실패하면, '처음부터 하지 말걸'이라는 후회가 오래 간다.", direction: "negative" },
  { id: 10, stage: 4, text: "나보다 잘하는 사람을 보면, 동기부여보다는 '나는 왜 안 되지'라는 생각이 더 크다.", direction: "negative" },
  { id: 11, stage: 4, text: "무언가를 해냈을 때, 그 성취를 스스로 인정하고 기뻐할 수 있다.", direction: "positive" },
  { id: 12, stage: 4, text: "결과가 좋지 않으면, 노력한 과정까지 무의미하게 느껴진다.", direction: "negative" },
  { id: 13, stage: 5, text: "내가 진짜 원하는 것이 무엇인지 잘 모르겠다는 느낌이 자주 든다.", direction: "negative" },
  { id: 14, stage: 5, text: "다른 사람의 기대나 사회적 역할을 빼면, '나'가 누구인지 설명하기 어렵다.", direction: "negative" },
  { id: 15, stage: 5, text: "나의 가치관과 방향이 비교적 명확하고, 그에 따라 선택하는 편이다.", direction: "positive" },
];
