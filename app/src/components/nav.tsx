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
  { href: "/#how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/demo", label: "Try it" },
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
        <Link href="/" className="flex items-center gap-3">
          <span className="flex flex-col items-center leading-none" aria-hidden>
            <span className="font-display text-lg leading-none tracking-tight">
              XII
            </span>
            <span className="text-[6.5px] font-bold uppercase tracking-[0.34em] text-muted">
              Man
            </span>
          </span>
          <span className="font-display text-xl uppercase leading-none tracking-tight">
            12th Man
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                pathname === l.href
                  ? "bg-pitch/40 text-gold"
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

    </header>
  );
}
