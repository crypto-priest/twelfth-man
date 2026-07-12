"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/chants", label: "Chants" },
  { href: "/matches", label: "Matches" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/card", label: "My Card" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "border-edge-soft bg-night/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="12th Man, home" className="flex flex-col items-center leading-none">
          <span className="font-display text-2xl leading-none tracking-tight">
            XII
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.34em] text-muted">
            Man
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-pitch text-night"
                  : "text-[#C7CDCB] hover:text-chalk"
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

    </header>
  );
}
