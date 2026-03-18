import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
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
          }}
        >
          {/* COGNIO logo */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              marginBottom: 32,
            }}
          >
            COGNIO
          </div>

          {/* Main text */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              lineHeight: 1.4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>당신의 마음은</span>
            <span>어디에서 멈춰 있나요?</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.5)",
              marginTop: 24,
            }}
          >
            발달심리학 기반 · 15문항 · 3분
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
