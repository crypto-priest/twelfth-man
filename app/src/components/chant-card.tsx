"use client";

import { getTeam } from "@/lib/teams";
import { shortAddr, timeAgo } from "@/lib/format";
import type { FeedChant } from "@/hooks/use-chants";
import { TeamBadge } from "./team-badge";

export function ChantCard({ chant }: { chant: FeedChant }) {
  const team = getTeam(chant.team);
  const isMatchDay = chant.matchId > 0;

  return (
    <article
      className={`panel relative overflow-hidden p-4 ${
        isMatchDay ? "border-transparent" : ""
      }`}
      style={
        isMatchDay
          ? {
              backgroundImage: `linear-gradient(#0c2419, #0c2419), linear-gradient(120deg, ${team.primary}, #f5c24b66, ${team.secondary})`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              border: "1px solid transparent",
            }
          : undefined
      }
    >
      {isMatchDay && (
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            background: `radial-gradient(320px 120px at 100% 0%, ${team.primary}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative flex items-center gap-2">
        <TeamBadge code={chant.team} />
        {isMatchDay && (
          <span
            className="-rotate-2 rounded-[6px] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest"
            style={{ background: `${team.primary}26`, color: team.primary }}
          >
            Match-day chant · #{chant.matchId}
          </span>
        )}
        {chant.live && <span className="live-bug">Live</span>}
        <span className="ml-auto text-xs text-grass">{timeAgo(chant.timestamp)}</span>
      </div>
      <p className="relative mt-3 text-[15px] leading-relaxed">{chant.text}</p>
      <p className="relative mt-3 text-xs text-grass">
        {shortAddr(chant.author.toBase58())}
      </p>
    </article>
  );
}
