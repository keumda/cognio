"use client";

import { useTestStore, PathType } from "@/store/useTestStore";

/* Inside Out 캐릭터 매핑 */
const paths = [
  {
    icon: "\uD83D\uDEE1\uFE0F",
    title: "완벽하지 않으면 불안해요",
    desc: "완벽주의 · 자기비난 · 미루기",
    value: "perfectionism" as PathType,
    color: "#F36A16", // 불안이 Anxiety
  },
  {
    icon: "\uD83D\uDD17",
    title: "관계에서 같은 패턴이 반복돼요",
    desc: "애착 · 신뢰 · 거리두기",
    value: "attachment" as PathType,
    color: "#3E67C8", // 슬픔이 Sadness
  },
  {
    icon: "\uD83C\uDF0A",
    title: "감정이 자꾸 압도돼요",
    desc: "감정조절 · 불안 · 예민함",
    value: "emotion" as PathType,
    color: "#EF3320", // 버럭이 Anger
  },
  {
    icon: "\u23F8\uFE0F",
    title: "시작하기가 너무 어려워요",
    desc: "미루기 · 무기력 · 집중",
    value: "initiation" as PathType,
    color: "#D6B8E8", // 당황이 Embarrassment
  },
];

export default function PathScreen() {
  const { selectedPath, setSelectedPath, setScreen } = useTestStore();

  return (
    <div className="min-h-dvh flex flex-col px-6 py-6 fade-in">
      <button
        onClick={() => setScreen("nickname")}
        className="text-[#60605d] text-[14px] mb-4 self-start flex items-center gap-1"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        뒤로
      </button>

      <h2 className="text-[22px] font-extrabold text-[#2A2475] mb-2">
        어떤 어려움이 가장 크게 와닿나요?
      </h2>
      <p className="text-[14px] text-[#60605d] mb-5">하나만 선택해주세요</p>

      <div className="flex flex-col gap-3 flex-1">
        {paths.map((p) => {
          const selected = selectedPath === p.value;
          return (
            <button
              key={p.value}
              onClick={() => setSelectedPath(p.value)}
              className="w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 relative"
              style={{
                borderColor: selected ? p.color : "#d0cfe1",
                backgroundColor: selected ? `${p.color}12` : "white",
                boxShadow: selected ? `0 4px 0 ${p.color}40` : "0 2px 0 #d0cfe1",
                transform: selected ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] flex-shrink-0"
                  style={{ backgroundColor: `${p.color}18` }}
                >
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-[#192950] mb-0.5">
                    {p.title}
                  </div>
                  <div className="text-[13px] text-[#60605d]">{p.desc}</div>
                </div>
                {selected && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: p.color }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-6 pb-4">
        <button
          onClick={() => { if (selectedPath) setScreen("question"); }}
          disabled={!selectedPath}
          className={`w-full py-4 text-[16px] ${
            selectedPath
              ? "btn-3d btn-3d-primary"
              : "rounded-2xl bg-[#d0cfe1] text-[#8c89b4] font-bold cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
