"use client";

import { useRef, useState } from "react";
import { fanSinceLabel, shortAddr } from "@/lib/format";
import type { FanCard } from "@/lib/fanpulse";
import { getTeam } from "@/lib/teams";
import { CountUp } from "./count-up";

const rest = { rx: 0, ry: 0, gx: 50, gy: 30 };

export function FanCardView({ fan }: { fan: FanCard }) {
  const team = getTeam(fan.team);
  const card = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(rest);
  const [held, setHeld] = useState(false);

  function onMove(e: React.MouseEvent) {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - py) * 16,
      ry: (px - 0.5) * 16,
      gx: px * 100,
      gy: py * 100,
    });
  }

  return (
    <div
      className="mx-auto w-full max-w-sm"
      style={{ perspective: "1100px" }}
      onMouseMove={onMove}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => {
        setHeld(false);
        setTilt(rest);
      }}
    >
      <div
        ref={card}
        className="relative overflow-hidden rounded-3xl p-[2px]"
        style={{
          // gold-threaded metallic edge that catches light as the card tilts
          background: `conic-gradient(from ${tilt.ry * 8 + 140}deg, ${team.primary}, #ffd75e 18%, ${team.secondary} 42%, #8a6d1f 60%, ${team.primary} 78%, #ffd75e 92%, ${team.primary})`,
          boxShadow: held
            ? `${-tilt.ry * 1.5}px ${tilt.rx * 1.5 + 24}px 60px rgba(0,0,0,0.55), 0 0 90px ${team.primary}45, 0 0 40px rgba(255,215,94,0.18)`
            : `0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${team.primary}35, 0 0 30px rgba(255,215,94,0.12)`,
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${held ? 1.03 : 1})`,
          transformStyle: "preserve-3d",
          transition: held
            ? "transform 80ms linear, box-shadow 80ms linear"
            : "transform 600ms cubic-bezier(0.2, 0.9, 0.3, 1.15), box-shadow 600ms ease",
        }}
      >
        <div className="relative overflow-hidden rounded-[calc(1.5rem-2px)] bg-night">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${team.primary}33 0%, transparent 45%, ${team.secondary}26 100%)`,
            }}
          />
          {/* foil sheen that shifts with the tilt */}
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from ${tilt.ry * 6 + 210}deg at 50% 40%, transparent 0deg, ${team.primary}22 70deg, #ffd75e1f 110deg, #ffffff12 130deg, transparent 190deg, ${team.secondary}1e 280deg, transparent 360deg)`,
              opacity: held ? 0.95 : 0.55,
              transition: "opacity 300ms ease",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              background:
                "repeating-linear-gradient(115deg, #fff 0, #fff 1px, transparent 1px, transparent 22px)",
            }}
          />
          {/* glare that follows the cursor */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(420px 320px at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,${held ? 0.14 : 0.05}), transparent 60%)`,
              transition: held ? undefined : "background 600ms ease",
            }}
          />

          <div className="relative p-7" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
                  Official Fan Card
                </p>
                <p className="mt-1 font-display text-4xl uppercase leading-none tracking-wide">
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
                  className="score-slant font-display text-4xl tabular-nums"
                />
              </div>
              <div className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-4">
                <p className="text-[11px] uppercase tracking-widest text-grass">Points</p>
                <CountUp
                  value={fan.points}
                  className="score-slant font-display text-4xl tabular-nums text-gold"
                />
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-grass">
                  Fan since
                </p>
                <p className="font-display text-lg uppercase">
                  {fanSinceLabel(fan.fanSince)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest text-grass">Holder</p>
                <p className="font-mono text-sm">{shortAddr(fan.owner.toBase58())}</p>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-display text-sm uppercase tracking-wider">
                <span className="text-gold">12</span>th Man
              </span>
              <span className="text-[11px] uppercase tracking-widest text-grass">
                World Cup 2026
              </span>
            </div>
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
