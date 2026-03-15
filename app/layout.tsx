import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIC MOMENT | 인생 4컷",
  description: "브라우저 카메라로 4컷 사진을 찍고 바로 다운로드할 수 있는 포토부스 서비스",
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
