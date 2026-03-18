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

  if (!ready) return null;

  switch (screen) {
    case "landing":
      return <LandingScreen />;
    case "nickname":
      return <NicknameScreen />;
    case "path":
      return <PathScreen />;
    case "question":
      return <QuestionScreen />;
    case "transition":
      return <TransitionScreen />;
    case "additional":
      return <AdditionalQuestionScreen />;
    case "loading":
      return <LoadingScreen />;
    case "result":
      return <ResultScreen />;
    case "share":
      return <ShareScreen />;
    case "cta":
      return <CTAScreen />;
    default:
      return <LandingScreen />;
  }
}
