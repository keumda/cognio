"use client";

import { useState } from "react";
import { useTestStore } from "@/store/useTestStore";

export default function NicknameScreen() {
  const { setNickname, setScreen } = useTestStore();
  const [name, setName] = useState("");

  const handleNext = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setNickname(trimmed);
    setScreen("path");
  };

  return (
    <div className="min-h-dvh flex flex-col px-6 py-6 fade-in">
      <button
        onClick={() => setScreen("landing")}
        className="text-[#60605d] text-[14px] mb-4 self-start flex items-center gap-1"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        뒤로
      </button>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-[48px] mb-4">{"\uD83D\uDC4B"}</div>
        <h2 className="text-[24px] font-extrabold text-[#2A2475] mb-2 leading-[1.35]">
          이름이나 닉네임을
          <br />
          알려주세요
        </h2>
        <p className="text-[14px] text-[#60605d] mb-8">
          결과에서 당신을 부를 이름이에요
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleNext(); }}
          placeholder="예: 민지, 코코, J"
          maxLength={10}
          autoFocus
          className="w-full px-5 py-4 rounded-2xl border-3 border-[#d0cfe1] text-[20px] font-bold text-[#2A2475] outline-none focus:border-[#3E67C8] transition-colors text-center placeholder:text-[#8c89b4] placeholder:font-normal"
        />
        <p className="text-[12px] text-[#8c89b4] mt-2 text-center">
          결과 공유 시 함께 표시돼요
        </p>
      </div>

      <div className="pt-6 pb-4">
        <button
          onClick={handleNext}
          disabled={!name.trim()}
          className={`w-full py-4 text-[16px] ${
            name.trim()
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
