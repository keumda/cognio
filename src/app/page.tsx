"use client";

import { useEffect, useState } from "react";
import { useTestStore } from "@/store/useTestStore";
import { decodeResult } from "@/lib/resultUrl";
import LandingScreen from "@/components/screens/LandingScreen";
import NicknameScreen from "@/components/screens/NicknameScreen";
import PathScreen from "@/components/screens/PathScreen";
import QuestionScreen from "@/components/screens/QuestionScreen";
import TransitionScreen from "@/components/screens/TransitionScreen";
import AdditionalQuestionScreen from "@/components/screens/AdditionalQuestionScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import ResultScreen from "@/components/screens/ResultScreen";
import ShareScreen from "@/components/screens/ShareScreen";
import CTAScreen from "@/components/screens/CTAScreen";

export default function Home() {
  const screen = useTestStore((s) => s.screen);
  const hydrate = useTestStore((s) => s.hydrate);
  const setNickname = useTestStore((s) => s.setNickname);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("r");
    const name = params.get("n");
    const isUnlocked = params.get("u") === "1";
    if (code) {
      const data = decodeResult(code);
      if (data) {
        hydrate({ ...data, nickname: name || "", unlocked: isUnlocked });
      }
    }
    if (name && !code) {
      setNickname(name);
    }
    setReady(true);
  }, [hydrate, setNickname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  if (!ready) return null;

  let content;
  switch (screen) {
    case "landing":
      content = <LandingScreen />; break;
    case "nickname":
      content = <NicknameScreen />; break;
    case "path":
      content = <PathScreen />; break;
    case "question":
      content = <QuestionScreen />; break;
    case "transition":
      content = <TransitionScreen />; break;
    case "additional":
      content = <AdditionalQuestionScreen />; break;
    case "loading":
      content = <LoadingScreen />; break;
    case "result":
      content = <ResultScreen />; break;
    case "share":
      content = <ShareScreen />; break;
    case "cta":
      content = <CTAScreen />; break;
    default:
      content = <LandingScreen />;
  }

  return (
    <div className="mx-auto max-w-[440px] min-h-dvh relative overflow-x-hidden">
      {content}
    </div>
  );
}
