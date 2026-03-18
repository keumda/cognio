"use client";

import { useTestStore } from "@/store/useTestStore";
import { pathwayLabels } from "@/lib/additionalQuestions";
import PerfectionismProfile from "./PerfectionismProfile";
import AttachmentMatrix from "./AttachmentMatrix";
import EmotionProfile from "./EmotionProfile";
import InitiationProfile from "./InitiationProfile";

export default function PathwayAnalysis() {
  const {
    selectedPath,
    additionalCompleted,
    getAdditionalScores,
    setScreen,
    setCurrentAdditionalQuestion,
  } = useTestStore();

  if (!selectedPath) return null;

  // Not completed: show upsell banner
  if (!additionalCompleted) {
    const pathLabel = pathwayLabels[selectedPath] || "";
    return (
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "#FFF8F0",
          border: "1px solid #F36A16",
        }}
      >
        <p className="text-[16px] font-bold text-[#2A2475] mb-2">
          {"\uD83D\uDD0D"} 더 정확한 분석이 가능해요
        </p>
        <p className="text-[14px] text-[#564a5d] leading-[1.6] mb-4">
          추가 6문항에 답하면 당신의 {pathLabel}을 3가지 유형으로
          세밀하게 분석해드려요.
        </p>
        <button
          onClick={() => {
            setCurrentAdditionalQuestion(1);
            setScreen("additional");
          }}
          className="w-full py-3 rounded-xl font-semibold text-[14px] text-white active:scale-[0.97] transition-all"
          style={{ backgroundColor: "#3E67C8" }}
        >
          추가 분석 받으러 가기 {"\u2192"}
        </button>
      </div>
    );
  }

  const scores = getAdditionalScores();

  switch (selectedPath) {
    case "perfectionism":
      return <PerfectionismProfile scores={scores} />;
    case "attachment":
      return <AttachmentMatrix scores={scores} />;
    case "emotion":
      return <EmotionProfile scores={scores} />;
    case "initiation":
      return <InitiationProfile scores={scores} />;
    default:
      return null;
  }
}
