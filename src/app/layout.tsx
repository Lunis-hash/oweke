import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ParticleBackground from "@/components/ui/ParticleBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "OWEKE — Fast Dating Vidéo en Rotation Directe",
  description: "Des rencontres réelles, chaleureuses et authentiques en visio de 5 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-[#fbf8f5] text-[#1c1917] font-sans antialiased min-h-screen relative overflow-x-hidden selection:bg-rose-500/20">
        <ParticleBackground />
        <Navbar />
        <div className="relative z-10 pt-24">
          {children}
        </div>
      </body>
    </html>
  );
}
