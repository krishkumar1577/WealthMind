import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wealthmind | Private Wealth Management",
  description: "Your private financial intelligence layer. AI-powered personal chartered accountant for tax, portfolio analysis, and document processing.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col overflow-hidden">
        <div className="grain-overlay"></div>
        <div className="radial-glow"></div>
        {children}
      </body>
    </html>
  );
}
