import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Instrument_Sans } from "next/font/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { TabDock } from "@/components/tab-dock";

const display = Archivo({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-display",
});

const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "12th Man: every team has eleven. You're the twelfth.",
  description:
    "Pick your World Cup team, cheer with fans worldwide and call the scores before kickoff. Every cheer and call is saved forever.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <div className="atmo" aria-hidden />
        <div className="pitch-lines" />
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
            {children}
          </main>
          <footer className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6 md:pb-10">
            <div className="border-t border-edge-soft pt-6 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted">
                12th Man
              </p>
              <p className="mt-2 text-xs text-grass">
                Every cheer and prediction is a real Solana transaction:
                permanent, provable, yours.
              </p>
              <p className="mt-2 space-x-4 text-xs">
                <Link href="/about" className="text-muted hover:text-chalk">
                  About
                </Link>
                <Link href="/demo" className="text-muted hover:text-chalk">
                  Try it
                </Link>
              </p>
            </div>
          </footer>
          <TabDock />
        </Providers>
      </body>
    </html>
  );
}
