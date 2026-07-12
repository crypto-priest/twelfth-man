"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/chants", label: "Chants" },
  { href: "/matches", label: "Matches" },
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
      <div className="relative mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" aria-label="12th Man, home" className="flex flex-col items-center leading-none">
          <span className="font-display text-2xl leading-none tracking-tight">
            XII
          </span>
          <span className="mt-0.5 text-[9px] font-bold uppercase leading-none tracking-[0.3em] text-chalk">
            Man
          </span>
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
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
