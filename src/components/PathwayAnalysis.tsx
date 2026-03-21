"use client";

import { useTestStore } from "@/store/useTestStore";
import PerfectionismProfile from "./PerfectionismProfile";
import AttachmentMatrix from "./AttachmentMatrix";
import EmotionProfile from "./EmotionProfile";
import InitiationProfile from "./InitiationProfile";

export default function PathwayAnalysis() {
  const {
    selectedPath,
    additionalCompleted,
    getAdditionalScores,
  } = useTestStore();

  if (!selectedPath || !additionalCompleted) return null;

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
