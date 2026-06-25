import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zin of Onzin? — Lesoverzicht",
  description: "Ontdek de 10 alarmbellen die je helpen om onzin te herkennen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>{children}</body>
    </html>
  );
}
