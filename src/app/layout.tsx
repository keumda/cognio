import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COGNIO - 나의 마음 성장 지도",
  description:
    "발달심리학 기반 심리 테스트. 15문항으로 알아보는 나의 마음 성장 지도. 임상심리전문가 감수.",
  metadataBase: new URL("https://cognio-test.vercel.app"),
  openGraph: {
    title: "COGNIO - 나의 마음 성장 지도",
    description:
      "Erikson 발달심리학 기반 15문항 심리 테스트. 3분이면 나의 마음 성장 지도를 확인할 수 있어요.",
    type: "website",
    siteName: "COGNIO",
    locale: "ko_KR",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "COGNIO - 나의 마음 성장 지도",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "COGNIO - 나의 마음 성장 지도",
    description:
      "Erikson 발달심리학 기반 15문항 심리 테스트. 3분이면 나의 마음 성장 지도를 확인할 수 있어요.",
    images: ["/api/og"],
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
        {children}
      </body>
    </html>
  );
}
