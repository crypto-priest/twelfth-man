"use client";

import { chantKey, useChants } from "@/hooks/use-chants";
import { getTeam } from "@/lib/teams";
import { timeAgo } from "@/lib/format";

export function ChantTicker() {
  const chants = useChants();

  return (
    <div className="panel flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-pitch animate-pulse-ring" />
          <span className="relative h-2 w-2 rounded-full bg-pitch" />
        </span>
        <span className="font-display text-lg font-bold uppercase tracking-wider">
          Live from the stands
        </span>
      </div>

      <div className="flex-1 space-y-1 overflow-hidden p-2">
        {chants === null ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-[52px] w-full" />
          ))
        ) : chants.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="text-3xl">📣</span>
            <p className="text-sm text-grass">
              Silence in the stadium… be the first voice.
            </p>
          </div>
        ) : (
          chants.slice(0, 8).map((c) => {
            const team = getTeam(c.team);
            return (
              <div
                key={chantKey(c)}
                className="flex items-start gap-3 rounded-xl px-3 py-2 animate-ticker-in hover:bg-white/[0.03]"
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
          })
        )}
      </div>
    </div>
  );
}
