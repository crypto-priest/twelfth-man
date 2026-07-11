import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "FanPulse — the pulse of World Cup passion, on-chain",
  description:
    "Register your fandom, post chants, lock predictions and put your fanbase on top of the on-chain leaderboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <div className="pitch-lines" />
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
