"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTeamStats } from "@/hooks/use-team-stats";
import { useFanCard } from "@/hooks/use-fan-card";
import { getTeam } from "@/lib/teams";
import { CountUp } from "@/components/count-up";
import { EmptyState } from "@/components/empty-state";

const rankColors = ["text-yellow-400", "text-slate-300", "text-amber-600"];

export default function LeaderboardPage() {
  const stats = useTeamStats();
  const { fan } = useFanCard();
  const prevRanks = useRef<Map<string, number>>(new Map());

  const movement = useMemo(() => {
    const moves = new Map<string, number>();
    stats?.forEach((t, i) => {
      const prev = prevRanks.current.get(t.code);
      moves.set(t.code, prev === undefined ? 0 : prev - i);
    });
    return moves;
  }, [stats]);

  useEffect(() => {
    if (stats) prevRanks.current = new Map(stats.map((t, i) => [t.code, i]));
  }, [stats]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight">
          Loudest fanbases
          <span className="text-pitch glow-text"> on the planet</span>
        </h1>
        <p className="mt-1 text-grass">
          Ranked by chants, then prediction points, then headcount. Updated
          straight from the chain.
        </p>
      </header>

      {stats === null ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-16" />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <EmptyState
          icon="🏆"
          title="Empty podium"
          body="No fanbase has made a sound yet. Register, chant once, and your nation tops the world."
        />
      ) : (
        <div className="panel overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_4.5rem_4.5rem] items-center gap-2 border-b border-edge px-4 py-2.5 text-[11px] uppercase tracking-widest text-grass sm:grid-cols-[3.5rem_1fr_5rem_5rem_5rem]">
            <span>#</span>
            <span>Fanbase</span>
            <span className="hidden text-right sm:block">Fans</span>
            <span className="text-right">Chants</span>
            <span className="text-right">Points</span>
          </div>

          {stats.map((t, i) => {
            const team = getTeam(t.code);
            const move = movement.get(t.code) ?? 0;
            const mine = fan?.team === t.code;
            return (
              <div
                key={t.code}
                className={`grid grid-cols-[3rem_1fr_4.5rem_4.5rem] items-center gap-2 border-b border-edge/60 px-4 py-3 transition-colors last:border-0 sm:grid-cols-[3.5rem_1fr_5rem_5rem_5rem] ${
                  mine ? "bg-pitch/[0.07]" : "hover:bg-white/[0.02]"
                }`}
                style={mine ? { boxShadow: "inset 3px 0 0 #00ff87" } : undefined}
              >
                <span
                  className={`font-display text-2xl font-bold tabular-nums ${
                    rankColors[i] ?? "text-grass"
                  }`}
                >
                  {i + 1}
                  {move !== 0 && (
                    <span
                      className={`ml-1 align-middle text-xs ${
                        move > 0 ? "text-pitch" : "text-red-400"
                      }`}
                    >
                      {move > 0 ? "▲" : "▼"}
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="text-2xl">{team.flag}</span>
                  <span className="truncate font-display text-xl font-semibold uppercase tracking-wide">
                    {team.name}
                  </span>
                  {mine && (
                    <span className="rounded-full bg-pitch/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-pitch">
                      You
                    </span>
                  )}
                </span>
                <CountUp
                  value={t.fanCount}
                  className="hidden text-right tabular-nums text-grass sm:block"
                />
                <CountUp
                  value={t.chantCount}
                  className="text-right font-display text-xl font-bold tabular-nums"
                />
                <CountUp
                  value={t.points}
                  className="text-right font-display text-xl font-bold tabular-nums text-pitch"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
