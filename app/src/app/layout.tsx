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
  title: "12th Man — every team has eleven. You're the twelfth.",
  description:
    "Pick your World Cup team, cheer with fans worldwide and call the scores before kickoff — every cheer and call is saved forever.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <div className="pitch-lines" />
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
            {children}
          </main>
          <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
            <p className="border-t border-edge pt-6 text-center text-xs text-grass">
              Every cheer and prediction is a real Solana transaction —
              permanent, provable, yours.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
