"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/matches",
    label: "Matches",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5 16 10.5l-1.5 4.5h-5L8 10.5 12 7.5ZM12 3v4.5M8 10.5l-4.2-1M16 10.5l4.2-1M9.5 15l-2.6 3.6M14.5 15l2.6 3.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    href: "/chants",
    label: "Chants",
    icon: (
      <path d="M4 10v4l10 4V6L4 10ZM14 8.5c2 .6 3 1.7 3 3.5s-1 2.9-3 3.5M6.5 14.5V18a1.5 1.5 0 0 0 3 0v-2.4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/leaderboard",
    label: "Ranks",
    icon: (
      <path d="M7 4h10v3a5 5 0 0 1-10 0V4ZM7 5H4v1a3.5 3.5 0 0 0 3 3.5M17 5h3v1a3.5 3.5 0 0 1-3 3.5M12 12v4m-3.5 4h7m-5.5 0v-4h4v4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/card",
    label: "Card",
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
        <path d="M9 7.5h6M9 16.5h6M12 10.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z" strokeLinecap="round" />
      </>
    ),
  },
];

export function TabDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center justify-between gap-1 rounded-[32px] border border-edge-soft bg-[#2E3944CC] px-2 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl md:hidden"
      aria-label="primary"
    >
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-3xl px-2 py-1.5 transition ${
              active ? "bg-pitch text-chalk" : "text-grass hover:text-chalk"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden
            >
              {t.icon}
            </svg>
            <span className="text-[10px] font-semibold">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
