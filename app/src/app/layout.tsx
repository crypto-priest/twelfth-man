import type { Metadata } from "next";
import Link from "next/link";
import { Anton, Instrument_Sans, Oswald } from "next/font/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { TabDock } from "@/components/tab-dock";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const head = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-head",
});

const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "12th Man — every team has eleven. You're the twelfth.",
  description:
    "Pick your World Cup team, cheer with fans worldwide and call the scores before kickoff — every cheer and call is saved forever.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${head.variable} ${body.variable}`}
    >
      <body className="font-sans">
        <div className="pitch-lines" />
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
            {children}
          </main>
          <footer className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6 md:pb-10">
            <div className="border-t border-edge pt-6 text-center">
              <p className="text-xs text-grass">
                Every cheer and prediction is a real Solana transaction —
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
