"use client";

import { useState, useEffect } from "react";
import { useTestStore } from "@/store/useTestStore";
import { LandingTree } from "@/components/TreeIllustration";

const SEED_COUNT = 127;

export default function LandingScreen() {
  const setScreen = useTestStore((s) => s.setScreen);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const local = parseInt(localStorage.getItem("rewrite_completions") || "0");
      setCount(SEED_COUNT + local);
    } catch {
      setCount(SEED_COUNT);
    }
  }, []);

  return (
    <div className="min-h-dvh flex flex-col px-6 py-6 fade-in">
      {/* Logo */}
      <div className="text-[14px] font-extrabold tracking-[0.15em] text-[#2A2475]">
        COGNIO
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-6">
        <div className="mb-8">
          <LandingTree />
        </div>

        <h1 className="text-[24px] font-extrabold text-[#2A2475] text-center leading-[1.35] mb-3">
          당신의 마음은<br />어디에서 멈춰 있나요?
        </h1>

        <p className="text-[14px] text-[#60605d] text-center mb-4">
          Erikson 발달심리학 기반 · 15문항 · 3분 · 무료
        </p>

        <div className="flex items-center justify-center gap-1.5 mb-8 px-4 py-2.5 rounded-2xl bg-[#f0f3fb] border border-[#d0cfe1]">
          <span className="text-[12px]">{"\uD83C\uDF93"}</span>
          <span className="text-[12px] text-[#2A2475] font-semibold">
            임상심리전문가 감수 · 발달심리학 이론 기반 설계
          </span>
        </div>

        <button
          onClick={() => setScreen("nickname")}
          className="btn-3d btn-3d-primary w-full max-w-[320px] py-4 text-[16px]"
        >
          나의 마음 성장 지도 확인하기
        </button>
      </div>

      <div className="text-center text-[13px] text-[#60605d] pb-4">
        <span>✓ 개인정보 수집 없음 · 학술 이론 기반</span>
        {count !== null && count > 0 && (
          <p className="mt-2 text-[#3E67C8] font-bold">
            {count.toLocaleString()}명이 참여했어요
          </p>
        )}
      </div>
    </div>
  );
}
