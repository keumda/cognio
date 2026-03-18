"use client";

import { useState, useCallback } from "react";
import { useTestStore } from "@/store/useTestStore";
import { additionalQuestions } from "@/lib/additionalQuestions";
import { BloomingTree } from "@/components/TreeIllustration";

function getBloomStage(questionIndex: number): number {
  if (questionIndex <= 2) return 1;
  if (questionIndex <= 4) return 2;
  return 3;
}

export default function AdditionalQuestionScreen() {
  const {
    selectedPath,
    currentAdditionalQuestion,
    setCurrentAdditionalQuestion,
    setAdditionalAnswer,
    additionalAnswers,
    setScreen,
    setAdditionalCompleted,
  } = useTestStore();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const questions = selectedPath ? additionalQuestions[selectedPath] : [];
  const question = questions[currentAdditionalQuestion - 1];
  const progress = (currentAdditionalQuestion / 6) * 100;
  const bloomStage = getBloomStage(currentAdditionalQuestion);
  const selectedValue = question ? additionalAnswers[question.id] || null : null;

  const handleSelect = useCallback(
    (value: number) => {
      if (!question) return;
      setAdditionalAnswer(question.id, value);
      setTimeout(() => {
        if (currentAdditionalQuestion < 6) {
          setDirection("forward");
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentAdditionalQuestion(currentAdditionalQuestion + 1);
            setIsTransitioning(false);
          }, 200);
        } else {
          setAdditionalCompleted(true);
          setScreen("loading");
        }
      }, 300);
    },
    [currentAdditionalQuestion, question, setAdditionalAnswer, setCurrentAdditionalQuestion, setScreen, setAdditionalCompleted]
  );

  const handleBack = useCallback(() => {
    if (currentAdditionalQuestion > 1) {
      setDirection("back");
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentAdditionalQuestion(currentAdditionalQuestion - 1);
        setIsTransitioning(false);
      }, 200);
    } else {
      setScreen("transition");
    }
  }, [currentAdditionalQuestion, setCurrentAdditionalQuestion, setScreen]);

  if (!question) return null;

  return (
    <div className="min-h-dvh flex flex-col px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleBack} className="text-[#60605d] p-1 -ml-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {/* 추가 문항 프로그레스 — 부럽이 틸 */}
        <div className="flex-1 h-[12px] bg-[#d0cfe1] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out relative"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #46C5B8, #3E67C8)",
            }}
          >
            <div
              className="absolute top-[2px] left-[4px] right-[4px] h-[4px] rounded-full"
              style={{ background: "rgba(255,255,255,0.3)" }}
            />
          </div>
        </div>
        <span className="text-[13px] text-[#46C5B8] font-bold min-w-[52px] text-right">
          추가 {currentAdditionalQuestion}/6
        </span>
      </div>

      {/* Question */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isTransitioning
            ? direction === "forward" ? "opacity-0 translate-x-6" : "opacity-0 -translate-x-6"
            : "opacity-100 translate-x-0"
        }`}
      >
        <div className="text-[13px] text-[#46C5B8] mb-2 font-bold">
          {question.id}
        </div>

        <h2 className="text-[18px] font-bold text-[#192950] leading-[1.6] mb-8">
          {question.text}
        </h2>

        <div className="mb-auto">
          <div className="flex justify-between mb-4 px-1">
            <span className="text-[12px] text-[#60605d] flex items-center gap-1">
              <span className="text-[16px]">{"\uD83D\uDE0C"}</span> 전혀 아니다
            </span>
            <span className="text-[12px] text-[#60605d] flex items-center gap-1">
              매우 그렇다 <span className="text-[16px]">{"\uD83D\uDE14"}</span>
            </span>
          </div>

          {/* 리커트 — 슬픔이 블루 */}
          <div className="flex justify-between items-center px-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const isSelected = selectedValue === value;
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(value)}
                  className="rounded-2xl transition-all duration-150 flex items-center justify-center font-bold"
                  style={{
                    width: isSelected ? "56px" : "48px",
                    height: isSelected ? "56px" : "48px",
                    backgroundColor: isSelected ? "#3E67C8" : "white",
                    color: isSelected ? "white" : "#8c89b4",
                    border: isSelected ? "none" : "2px solid #d0cfe1",
                    boxShadow: isSelected ? "0 4px 0 #2a4688" : "0 3px 0 #d0cfe1",
                    transform: isSelected ? "translateY(-2px)" : "translateY(0)",
                    fontSize: "15px",
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center mt-3">
            <span className="text-[11px] text-[#8c89b4]">보통이다</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <BloomingTree stage={bloomStage} />
      </div>
    </div>
  );
}
