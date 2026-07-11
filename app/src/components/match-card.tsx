"use client";

import { useState } from "react";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  predictIx,
  sendIx,
  settlePredictionIx,
  type FanCard,
  type Match,
  type Prediction,
} from "@/lib/fanpulse";
import { getTeam } from "@/lib/teams";
import { kickoffLabel } from "@/lib/format";
import type { LiveScore } from "@/hooks/use-live-scores";

function Side({ code, align }: { code: string; align: "left" | "right" }) {
  const team = getTeam(code);
  return (
    <div
      className={`flex items-center gap-3 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span className="text-4xl">{team.flag}</span>
      <div>
        <p className="font-display text-2xl font-bold uppercase leading-none tracking-wide">
          {team.code}
        </p>
        <p className="mt-1 text-xs text-grass">{team.name}</p>
      </div>
    </div>
  );
}

function Stepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[11px] uppercase tracking-widest text-grass">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-9 w-9 rounded-full border border-edge text-lg text-grass transition hover:border-pitch/50 hover:text-pitch"
          aria-label={`decrease ${label} score`}
        >
          −
        </button>
        <span className="w-12 text-center font-display text-4xl font-bold tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(20, value + 1))}
          className="h-9 w-9 rounded-full border border-edge text-lg text-grass transition hover:border-pitch/50 hover:text-pitch"
          aria-label={`increase ${label} score`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function MatchCard({
  match,
  prediction,
  fan,
  live,
  onChanged,
}: {
  match: Match;
  prediction?: Prediction;
  fan: FanCard | null;
  live?: LiveScore;
  onChanged?: () => void;
}) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upcoming = !match.settled && match.kickoffTs * 1000 > Date.now();
  const inPlay = !match.settled && !upcoming;
  const liveNow = inPlay && live?.state === "in";

  async function run(build: () => ReturnType<typeof predictIx>) {
    if (!publicKey || busy) return;
    setBusy(true);
    setError(null);
    try {
      await sendIx(connection, { publicKey, sendTransaction }, build());
      onChanged?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="panel overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between gap-2 border-b border-edge px-5 py-2.5 text-xs">
        <span className="uppercase tracking-widest text-grass">
          Match #{match.id}
        </span>
        {match.settled ? (
          <span className="font-bold uppercase tracking-widest text-chalk">
            Full time
          </span>
        ) : inPlay ? (
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-pitch">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-pitch animate-pulse-ring" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-pitch" />
            </span>
            {liveNow ? `Live · ${live.clock}` : live?.state === "post" ? "FT · confirming on-chain" : "Awaiting result"}
          </span>
        ) : (
          <span className="text-grass">{kickoffLabel(match.kickoffTs)}</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-5">
        <Side code={match.home} align="left" />
        {match.settled || inPlay ? (
          <div className="font-display text-5xl font-bold tabular-nums tracking-tight">
            {match.settled ? (
              <>
                {match.homeScore}
                <span className="mx-1 text-grass">–</span>
                {match.awayScore}
              </>
            ) : live && live.state !== "pre" ? (
              <>
                {live.homeScore}
                <span className="mx-1 text-grass">–</span>
                {live.awayScore}
              </>
            ) : (
              <span className="text-grass">·</span>
            )}
          </div>
        ) : (
          <span className="font-display text-2xl font-semibold uppercase text-grass">
            vs
          </span>
        )}
        <Side code={match.away} align="right" />
      </div>

      <div className="border-t border-edge bg-night/40 px-5 py-4">
        {prediction ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-grass">
                Your call — locked{" "}
                {new Date(prediction.predictedAt * 1000).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="font-display text-3xl font-bold tabular-nums">
                {prediction.homeScore}
                <span className="mx-1 text-grass">–</span>
                {prediction.awayScore}
              </p>
            </div>
            {prediction.settled ? (
              <span
                className={`ml-auto rounded-full px-4 py-1.5 text-sm font-bold ${
                  prediction.points === 3
                    ? "bg-pitch/15 text-pitch"
                    : prediction.points === 1
                      ? "bg-amber-400/15 text-amber-300"
                      : "bg-white/5 text-grass"
                }`}
              >
                {prediction.points === 3
                  ? "Exact score · +3 pts"
                  : prediction.points === 1
                    ? "Right outcome · +1 pt"
                    : "Off the mark · 0 pts"}
              </span>
            ) : match.settled && fan ? (
              <button
                onClick={() =>
                  run(() => settlePredictionIx(match.id, publicKey!, fan.team))
                }
                disabled={busy}
                className="ml-auto rounded-full bg-pitch px-5 py-2 text-sm font-semibold text-night transition hover:bg-[#33ff9f] disabled:opacity-40"
              >
                {busy ? "Claiming…" : "Claim points"}
              </button>
            ) : (
              <span className="ml-auto text-xs uppercase tracking-widest text-grass">
                {match.settled ? "" : "🔒 Immutable"}
              </span>
            )}
          </div>
        ) : upcoming ? (
          publicKey && fan ? (
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Stepper value={home} onChange={setHome} label={getTeam(match.home).code} />
              <Stepper value={away} onChange={setAway} label={getTeam(match.away).code} />
              <button
                onClick={() => run(() => predictIx(publicKey, match.id, home, away))}
                disabled={busy}
                className="rounded-full bg-pitch px-6 py-2.5 text-sm font-semibold text-night transition hover:bg-[#33ff9f] disabled:opacity-40"
              >
                {busy ? "Locking…" : "Lock prediction"}
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-grass">
              {publicKey ? (
                <>
                  <Link href="/card" className="text-pitch underline-offset-4 hover:underline">
                    Mint your Fan Card
                  </Link>{" "}
                  to lock a prediction.
                </>
              ) : (
                "Connect a wallet to call the score before kickoff."
              )}
            </p>
          )
        ) : (
          <p className="text-center text-xs uppercase tracking-widest text-grass">
            Predictions closed at kickoff
          </p>
        )}
        {error && <p className="mt-2 break-all text-xs text-red-400">{error}</p>}
      </div>
    </article>
  );
}
