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
          background: `conic-gradient(from ${tilt.ry * 8 + 140}deg, ${team.primary}, #d3d9d4 18%, ${team.secondary} 42%, #43555c 60%, ${team.primary} 78%, #d3d9d4 92%, ${team.primary})`,
          boxShadow: held
            ? `${-tilt.ry * 1.5}px ${tilt.rx * 1.5 + 24}px 60px rgba(0,0,0,0.55), 0 0 90px ${team.primary}45, 0 0 40px rgba(211,217,212,0.2)`
            : `0 20px 60px rgba(0,0,0,0.5), 0 0 80px ${team.primary}35, 0 0 30px rgba(211,217,212,0.14)`,
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${held ? 1.03 : 1})`,
          transformStyle: "preserve-3d",
          transition: held
            ? "transform 80ms linear, box-shadow 80ms linear"
            : "transform 600ms cubic-bezier(0.2, 0.9, 0.3, 1.15), box-shadow 600ms ease",
        }}
      >
        <div className="relative overflow-hidden rounded-[calc(1.5rem-2px)] bg-[#1A2228] text-[#D3D9D4]">
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
              background: `conic-gradient(from ${tilt.ry * 6 + 210}deg at 50% 40%, transparent 0deg, ${team.primary}22 70deg, #d3d9d41f 110deg, #ffffff12 130deg, transparent 190deg, ${team.secondary}1e 280deg, transparent 360deg)`,
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
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-display text-xl leading-none"
                style={{ borderColor: `${team.primary}88`, color: team.primary }}
              >
                {team.code.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#82B4CD]">
                  Official Fan Card
                </p>
                <p className="mt-1 font-display text-4xl uppercase leading-none tracking-wide">
                  {team.name}
                </p>
              </div>
              <span className="text-4xl drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                {team.flag}
              </span>
            </div>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#82B4CD]/40 bg-[#82B4CD]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#82B4CD]">
              ✓ Verified fan
            </span>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <p className="text-[10px] uppercase tracking-widest text-[#A9BAC0]">Chants</p>
                <CountUp
                  value={fan.chantCount}
                  className="score-slant font-display text-3xl tabular-nums"
                />
              </div>
              <div className="rounded-2xl border border-[#82B4CD]/20 bg-[#82B4CD]/[0.07] p-3.5">
                <p className="text-[10px] uppercase tracking-widest text-[#A9BAC0]">Points</p>
                <CountUp
                  value={fan.points}
                  className="score-slant font-display text-3xl tabular-nums text-[#82B4CD]"
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <p className="text-[10px] uppercase tracking-widest text-[#A9BAC0]">
                  Fan since
                </p>
                <p className="mt-1 font-display text-base uppercase leading-tight">
                  {fanSinceLabel(fan.fanSince)}
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#A9BAC0]">Holder</p>
                <p className="font-mono text-sm">{shortAddr(fan.owner.toBase58())}</p>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-display text-sm uppercase tracking-wider">
                <span className="text-[#82B4CD]">12</span>th Man
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#A9BAC0]">
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
  const text = `My ${team.flag} ${team.name} Fan Card: ${fan.chantCount} chants, ${fan.points} pts on 12th Man. Every team has eleven, I'm the twelfth. #12thMan #WorldCup2026`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
