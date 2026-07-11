"use client";

import { fanSinceLabel, shortAddr } from "@/lib/format";
import type { FanCard } from "@/lib/fanpulse";
import { getTeam } from "@/lib/teams";
import { CountUp } from "./count-up";

export function FanCardView({ fan }: { fan: FanCard }) {
  const team = getTeam(fan.team);

  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl p-[1.5px]"
      style={{
        background: `linear-gradient(160deg, ${team.primary}, ${team.secondary})`,
        boxShadow: `0 0 80px ${team.primary}40, 0 20px 60px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="relative overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-night">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${team.primary}33 0%, transparent 45%, ${team.secondary}26 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            background:
              "repeating-linear-gradient(115deg, #fff 0, #fff 1px, transparent 1px, transparent 22px)",
          }}
        />

        <div className="relative p-7">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: team.primary }}
              >
                Official Fan Card
              </p>
              <p className="mt-1 font-display text-4xl font-bold uppercase leading-none tracking-wide">
                {team.name}
              </p>
            </div>
            <span className="text-5xl drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]">
              {team.flag}
            </span>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-widest text-grass">Chants</p>
              <CountUp
                value={fan.chantCount}
                className="font-display text-4xl font-bold tabular-nums"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] uppercase tracking-widest text-grass">Points</p>
              <CountUp
                value={fan.points}
                className="font-display text-4xl font-bold tabular-nums text-pitch"
              />
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-grass">Fan since</p>
              <p className="font-display text-lg font-semibold uppercase">
                {fanSinceLabel(fan.fanSince)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-grass">Holder</p>
              <p className="font-mono text-sm">{shortAddr(fan.owner.toBase58())}</p>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-display text-sm font-bold uppercase tracking-wider">
              <span className="text-pitch">12</span>th Man
            </span>
            <span className="text-[11px] uppercase tracking-widest text-grass">
              World Cup 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function shareOnXUrl(fan: FanCard): string {
  const team = getTeam(fan.team);
  const text = `My ${team.flag} ${team.name} Fan Card — ${fan.chantCount} chants, ${fan.points} pts on 12th Man. Every team has eleven, I'm the twelfth. #12thMan #WorldCup2026`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
