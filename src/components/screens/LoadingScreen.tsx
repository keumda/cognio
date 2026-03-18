"use client";

import { useState, useEffect } from "react";
import { useTestStore } from "@/store/useTestStore";
import { LoadingTree } from "@/components/TreeIllustration";

const messages = [
  "당신의 마음 성장 지도를 그리고 있어요...",
  "거의 완성됐어요...",
];

export default function LoadingScreen() {
  const setScreen = useTestStore((s) => s.setScreen);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Count completion (once per test run)
    try {
      const counted = sessionStorage.getItem("rewrite_counted");
      if (!counted) {
        const prev = parseInt(localStorage.getItem("rewrite_completions") || "0");
        localStorage.setItem("rewrite_completions", String(prev + 1));
        sessionStorage.setItem("rewrite_counted", "1");
      }
    } catch {
      // ignore
    }

    const timer1 = setTimeout(() => setMessageIndex(1), 1000);
    const timer2 = setTimeout(() => setScreen("result"), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setScreen]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 fade-in">
      <div className="mb-8">
        <LoadingTree />
      </div>
      <p className="text-[16px] text-[#2A2475] text-center transition-all duration-300">
        {messages[messageIndex]}
      </p>
    </div>
  );
}
