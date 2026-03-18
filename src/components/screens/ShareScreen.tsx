"use client";

import { useRef, useCallback } from "react";
import { useTestStore } from "@/store/useTestStore";
import { resultTypes, stageLabels } from "@/data/resultTypes";

function getBarColor(score: number): string {
  if (score >= 70) return "#3E67C8";
  if (score >= 50) return "#D6B8E8";
  return "#F36A16";
}

export default function ShareScreen() {
  const { getStagePercentages, getResultType, setScreen, nickname } = useTestStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const percentages = getStagePercentages();
  const typeKey = getResultType();
  const typeData = resultTypes[typeKey] || resultTypes["1"];

  const stages = [
    { label: "신뢰", score: percentages[1] },
    { label: "자율", score: percentages[2] },
    { label: "시작", score: percentages[3] },
    { label: "성취", score: percentages[4] },
    { label: "정체성", score: percentages[5] },
  ];

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });
    return canvas;
  }, []);

  const handleDownload = useCallback(async () => {
    const canvas = await generateImage();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "cognio-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [generateImage]);

  const handleInstagramShare = useCallback(async () => {
    await handleDownload();
    alert("이미지가 저장되었습니다. 인스타그램 스토리에 업로드해주세요!");
  }, [handleDownload]);

  const handleKakaoShare = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다! 카카오톡에 공유해주세요.");
    }
  }, []);

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 fade-in">
      {/* Back button */}
      <button
        onClick={() => setScreen("result")}
        className="text-[#60605d] text-[14px] mb-6 self-start flex items-center gap-1"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        결과로 돌아가기
      </button>

      {/* ===== Share Card (9:16) ===== */}
      <div
        ref={cardRef}
        className="w-full rounded-2xl overflow-hidden mx-auto mb-8"
        style={{
          aspectRatio: "9/16",
          maxWidth: "320px",
          background: "linear-gradient(170deg, #110e2f 0%, #2A2475 40%, #3E67C8 100%)",
          position: "relative",
        }}
      >
        {/* Ambient glow behind emoji */}
        <div
          style={{
            position: "absolute",
            top: "28%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle decorative ring */}
        <div
          style={{
            position: "absolute",
            top: "28%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            border: "1px solid rgba(201,168,76,0.12)",
            pointerEvents: "none",
          }}
        />

        <div
          className="flex flex-col items-center justify-between h-full relative"
          style={{ padding: "32px 24px 28px" }}
        >
          {/* Top: Logo */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            COGNIO
          </div>

          {/* Nickname */}
          {nickname && (
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                marginTop: "4px",
              }}
            >
              {nickname}님의 마음 성장 지도
            </p>
          )}

          {/* Center block: Emoji + Type name + Poetic */}
          <div className="flex flex-col items-center text-center" style={{ marginTop: nickname ? "0px" : "-8px" }}>
            {/* Big emoji */}
            <div style={{ fontSize: "56px", marginBottom: "16px", lineHeight: 1 }}>
              {typeData.emoji}
            </div>

            {/* Type name */}
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.3,
                marginBottom: "12px",
                letterSpacing: "-0.02em",
              }}
            >
              {typeData.name}
            </h2>

            {/* Divider line */}
            <div
              style={{
                width: "40px",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #D6B8E8, transparent)",
                marginBottom: "14px",
              }}
            />

            {/* Poetic line */}
            <p
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#D6B8E8",
                lineHeight: 1.8,
                fontStyle: "italic",
                maxWidth: "240px",
              }}
            >
              {typeData.poetic}
            </p>
          </div>

          {/* Bottom block: Score bars + CTA */}
          <div className="w-full">
            {/* 5 score indicators */}
            <div className="flex flex-col gap-2 mb-6" style={{ padding: "0 4px" }}>
              {stages.map(({ label, score }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.45)",
                      minWidth: "40px",
                      textAlign: "right",
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${score}%`,
                        backgroundColor: getBarColor(score),
                        borderRadius: "3px",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: getBarColor(score),
                      minWidth: "28px",
                      textAlign: "right",
                      opacity: 0.85,
                    }}
                  >
                    {score}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.08)",
                marginBottom: "14px",
              }}
            />

            {/* Credibility + CTA */}
            <p
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.25)",
                textAlign: "center",
                marginBottom: "6px",
              }}
            >
              Erikson 발달심리학 기반 · 임상심리전문가 감수
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                letterSpacing: "0.03em",
              }}
            >
              나도 해보기 {"→"} cognio-test.com
            </p>
          </div>
        </div>
      </div>

      {/* ===== Share Buttons ===== */}
      <div className="flex flex-col gap-2.5 pb-4">
        <button
          onClick={handleInstagramShare}
          className="w-full py-3.5 rounded-xl font-semibold text-[14px] text-white active:scale-[0.97] transition-all"
          style={{
            background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
          }}
        >
          인스타 스토리에 공유
        </button>
        <button
          onClick={handleKakaoShare}
          className="w-full py-3.5 rounded-xl font-semibold text-[14px] active:scale-[0.97] transition-all"
          style={{ backgroundColor: "#FEE500", color: "#391B1B" }}
        >
          카카오톡에 공유
        </button>
        <button
          onClick={handleDownload}
          className="w-full py-3.5 rounded-xl font-semibold text-[14px] text-[#60605d] border-2 border-[#d0cfe1] active:scale-[0.97] transition-all"
        >
          이미지 저장
        </button>
      </div>
    </div>
  );
}
