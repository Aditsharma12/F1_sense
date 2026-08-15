import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { F1SenseProvider } from "@/context/F1SenseContext";
import AppShell from "@/components/AppShell";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F1 Sense | Telemetry & Audio AI",
  description: "Real-time F1 Vocal Stress Analysis & Vehicle Telemetry Anomaly Engine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-gray-900 selection:bg-[#ff5500] selection:text-white bg-[#f8f5f0]">
        <F1SenseProvider>
          <AppShell>
            {children}
          </AppShell>
        </F1SenseProvider>
      </body>
    </html>
  );
}
