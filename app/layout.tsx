import { Suspense } from "react";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import BfcacheHandler from "@/components/BfcacheHandler";
import NavigationProgress from "@/components/NavigationProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CandidAI — Practice smarter. Interview with confidence.",
  description:
    "Production-grade AI mock interview preparation platform. Tailored technical and behavioral practice sessions, real-time voice feedback, and structured performance analytics.",
  icons: {
    icon: "/candidai-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-[#07090D] text-[#F8FAFC] min-h-screen selection:bg-[#7652FF]/30 selection:text-white`}
        suppressHydrationWarning
      >
        <BfcacheHandler />
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <Toaster
          richColors
          theme="dark"
          toastOptions={{
            className: "!bg-[#111621] !border-[#222A38] !text-[#F8FAFC]",
          }}
        />
      </body>
    </html>
  );
}

