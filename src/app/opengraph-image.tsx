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
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          당신의 마음은
          <br />
          어디에서 멈춰 있나요?
        </div>
      </div>
    ),
    { ...size }
  );
}
