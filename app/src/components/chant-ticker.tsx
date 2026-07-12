"use client";

import Link from "next/link";
import { chantKey, useChants } from "@/hooks/use-chants";
import { getTeam } from "@/lib/teams";
import { timeAgo } from "@/lib/format";

export function ChantTicker() {
  const chants = useChants();

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-edge px-4 py-3">
        <span className="live-bug">Live</span>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-grass">
          From the stands
        </span>
      </div>

      <div className="flex-1 space-y-1 overflow-hidden p-2">
        {chants === null ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-[52px] w-full" />
          ))
        ) : (
          <>
            {chants.slice(0, 6).map((c, i) => {
              const team = getTeam(c.team);
              return (
                <div
                  key={chantKey(c)}
                  className="flex items-start gap-3 rounded-xl px-3 py-2 animate-ticker-in hover:bg-chalk/[0.03]"
                  style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
                >
                  <span className="mt-0.5 text-xl">{team.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{c.text}</p>
                    <p className="mt-0.5 text-[11px] text-grass">
                      <span style={{ color: team.primary }} className="font-semibold">
                        {team.code}
                      </span>{" "}
                      · {timeAgo(c.timestamp)}
                      {c.matchId > 0 && ` · match #${c.matchId}`}
                    </p>
                  </div>
                </div>
              );
            })}
            {chants.length < 3 && (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <span className="text-3xl">📣</span>
                <p className="text-sm text-grass">
                  The stands are warming up. Add your voice.
                </p>
                <Link
                  href="/chants"
                  className="rounded-full bg-pitch px-5 py-2 text-sm font-semibold text-night transition hover:bg-pitch-2"
                >
                  Post a chant
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
