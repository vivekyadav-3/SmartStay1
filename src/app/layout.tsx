import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartStay | Modern Hostel Platform",
  description: "A clean, student and admin friendly hostel management platform without the corporate nonsense.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased dark`} suppressHydrationWarning>
        <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
