import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { TranslationProvider } from "./contexts/TranslationContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FruitAI - Freshness Analyzer",
  description: "AI-powered fruit and vegetable freshness analyzer for smart grocery shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen`}>
          <TranslationProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </TranslationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}