"use client";

import { useTestStore } from "@/store/useTestStore";
import { GrowingTree } from "@/components/TreeIllustration";
import { pathwayLabels } from "@/lib/additionalQuestions";

export default function TransitionScreen() {
  const { selectedPath, setScreen, setAdditionalCompleted } = useTestStore();
  const pathLabel = selectedPath ? pathwayLabels[selectedPath] : "";

  const handleContinue = () => {
    const shown = parseInt(localStorage.getItem("additional_questions_shown") || "0") + 1;
    localStorage.setItem("additional_questions_shown", String(shown));
    const clicked = parseInt(localStorage.getItem("additional_questions_clicked") || "0") + 1;
    localStorage.setItem("additional_questions_clicked", String(clicked));
    setScreen("additional");
  };

  const handleSkip = () => {
    const shown = parseInt(localStorage.getItem("additional_questions_shown") || "0") + 1;
    localStorage.setItem("additional_questions_shown", String(shown));
    const skipped = parseInt(localStorage.getItem("additional_questions_skipped") || "0") + 1;
    localStorage.setItem("additional_questions_skipped", String(skipped));
    setAdditionalCompleted(false);
    setScreen("loading");
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 fade-in">
      <div className="mb-8">
        <GrowingTree stage={5} />
      </div>

      <h2 className="text-[20px] font-extrabold text-[#2A2475] text-center mb-3">
        기본 분석이 완료되었어요
      </h2>

      <p className="text-[14px] text-[#60605d] text-center leading-[1.7] mb-8">
        &apos;{pathLabel}&apos; 심화 분석을 위해
        <br />
        6문항만 더 답해주세요
      </p>

      <button
        onClick={handleContinue}
        className="btn-3d btn-3d-primary w-full max-w-[320px] py-4 text-[16px] mb-4"
      >
        더 정확한 분석 받기
      </button>

      <button
        onClick={handleSkip}
        className="text-[14px] text-[#8c89b4] transition-colors hover:text-[#2A2475]"
      >
        바로 결과 보기
      </button>
    </div>
  );
}
