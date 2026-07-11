"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const WalletButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

const links = [
  { href: "/", label: "Home" },
  { href: "/chants", label: "Chants" },
  { href: "/matches", label: "Matches" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/card", label: "My Card" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-night/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-pitch animate-pulse-ring" />
            <span className="relative rounded-full h-2.5 w-2.5 bg-pitch" />
          </span>
          <span className="font-display text-2xl font-bold uppercase tracking-wider">
            Fan<span className="text-pitch">Pulse</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                pathname === l.href
                  ? "bg-pitch/10 text-pitch"
                  : "text-grass hover:text-chalk"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto">
          <WalletButton />
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm ${
              pathname === l.href
                ? "bg-pitch/10 text-pitch"
                : "text-grass"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
