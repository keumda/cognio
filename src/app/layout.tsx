import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COGNIO - 나의 마음 성장 지도",
  description:
    "발달심리학 기반 심리 테스트. 15문항으로 알아보는 나의 마음 성장 지도. 임상심리전문가 감수.",
  metadataBase: new URL("https://cognio-test.com"),
  openGraph: {
    title: "당신의 마음은 어디에서 멈춰 있나요?",
    description:
      "Erikson 발달심리학 기반 15문항 심리 테스트. 3분이면 나의 마음 성장 지도를 확인할 수 있어요.",
    type: "website",
    siteName: "COGNIO",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "당신의 마음은 어디에서 멈춰 있나요?",
    description:
      "Erikson 발달심리학 기반 15문항 심리 테스트. 3분이면 나의 마음 성장 지도를 확인할 수 있어요.",
  },
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="mx-auto max-w-[440px] min-h-dvh relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
