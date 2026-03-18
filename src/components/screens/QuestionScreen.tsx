"use client";

import { useState, useCallback } from "react";
import { useTestStore } from "@/store/useTestStore";
import { questions } from "@/data/questions";
import { GrowingTree } from "@/components/TreeIllustration";

function getTreeStage(questionIndex: number): number {
  if (questionIndex <= 3) return 1;
  if (questionIndex <= 6) return 2;
  if (questionIndex <= 9) return 3;
  if (questionIndex <= 12) return 4;
  return 5;
}

export default function QuestionScreen() {
  const { currentQuestion, setCurrentQuestion, setAnswer, answers, setScreen } =
    useTestStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const question = questions[currentQuestion - 1];
  const progress = (currentQuestion / 15) * 100;
  const treeStage = getTreeStage(currentQuestion);
  const selectedValue = answers[currentQuestion] || null;

  const handleSelect = useCallback(
    (value: number) => {
      setAnswer(currentQuestion, value);
      setTimeout(() => {
        if (currentQuestion < 15) {
          setDirection("forward");
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentQuestion(currentQuestion + 1);
            setIsTransitioning(false);
          }, 200);
        } else {
          setScreen("transition");
        }
      }, 300);
    },
    [currentQuestion, setAnswer, setCurrentQuestion, setScreen]
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 1) {
      setDirection("back");
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 200);
    } else {
      setScreen("path");
    }
  }, [currentQuestion, setCurrentQuestion, setScreen]);

  return (
    <div className="min-h-dvh flex flex-col px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleBack} className="text-[#60605d] p-1 -ml-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[13px] text-[#60605d] font-bold min-w-[36px] text-right">
          {currentQuestion}/15
        </span>
      </div>

      {/* Question */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isTransitioning
            ? direction === "forward"
              ? "opacity-0 translate-x-6"
              : "opacity-0 -translate-x-6"
            : "opacity-100 translate-x-0"
        }`}
      >
        <div className="text-[13px] text-[#3E67C8] font-bold mb-2">Q{currentQuestion}</div>

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

          {/* Likert — Inside Out colors */}
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
                    boxShadow: isSelected
                      ? "0 4px 0 #2a4688"
                      : "0 3px 0 #d0cfe1",
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
        <GrowingTree stage={treeStage} />
      </div>
    </div>
  );
}
