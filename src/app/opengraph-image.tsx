import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "COGNIO - 나의 마음 성장 지도";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2A2475 0%, #3E67C8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#46C5B8",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 100,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "#E8D43A",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 180,
            right: 200,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#D6B8E8",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 200,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#F36A16",
            opacity: 0.15,
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 24,
          }}
        >
          COGNIO
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: 16,
          }}
        >
          당신의 마음은
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: 32,
          }}
        >
          어디에서 멈춰 있나요?
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
          }}
        >
          발달심리학 기반 · 15문항 · 3분 · 무료
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
            임상심리전문가 감수 · Erikson 발달심리학 이론 기반
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
