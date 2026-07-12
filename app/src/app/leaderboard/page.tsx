"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useTeamStats } from "@/hooks/use-team-stats";
import { useFanCard } from "@/hooks/use-fan-card";
import { getTeam } from "@/lib/teams";
import { CountUp } from "@/components/count-up";
import { EmptyState } from "@/components/empty-state";
import { StartBanner } from "@/components/start-banner";

const rankColors = ["text-gold", "text-[#cfd8cf]", "text-[#d8925a]"];

export default function LeaderboardPage() {
  const stats = useTeamStats();
  const { fan, loading, connected } = useFanCard();
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
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          Loudest fanbases
          <span className="text-gold glow-gold"> on the planet</span>
        </h1>
        <p className="mt-1 text-grass">
          Countries ranked by chants, then prediction points, then fan count.
          Updates live all tournament.
        </p>
      </header>

      <StartBanner
        connected={connected}
        fan={fan}
        loading={loading}
        action="get your country on this board"
      />

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
          body="No fanbase has made a sound yet. Get your Fan Card, post one chant, and your country tops the world."
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
              <motion.div
                key={t.code}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                className={`grid grid-cols-[3rem_1fr_4.5rem_4.5rem] items-center gap-2 overflow-hidden border-b border-edge/60 px-4 py-3 transition-colors last:border-0 sm:grid-cols-[3.5rem_1fr_5rem_5rem_5rem] ${
                  mine ? "bg-gold/[0.06]" : "hover:bg-white/[0.02]"
                }`}
                style={mine ? { boxShadow: "inset 3px 0 0 #ffd75e" } : undefined}
              >
                <span
                  className={`score-slant -my-1 font-display tabular-nums leading-none ${
                    i < 3 ? "text-4xl" : "text-2xl"
                  } ${rankColors[i] ?? "text-grass/70"}`}
                >
                  {i + 1}
                  {move !== 0 && (
                    <span
                      className={`ml-1 align-middle font-sans text-xs ${
                        move > 0 ? "text-pitch" : "text-red-400"
                      }`}
                    >
                      {move > 0 ? "▲" : "▼"}
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="text-2xl">{team.flag}</span>
                  <span className="truncate font-display text-xl uppercase tracking-wide">
                    {team.name}
                  </span>
                  {mine && (
                    <span className="-rotate-2 rounded-[5px] bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-night">
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
                  className="text-right font-display text-xl tabular-nums"
                />
                <CountUp
                  value={t.points}
                  className="text-right font-display text-xl tabular-nums text-gold"
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
