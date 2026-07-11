"use client";

import Link from "next/link";
import { useTeamStats } from "@/hooks/use-team-stats";
import { getTeam } from "@/lib/teams";
import { ChantTicker } from "@/components/chant-ticker";
import { CountUp } from "@/components/count-up";

const medals = ["🥇", "🥈", "🥉"];

export default function Home() {
  const stats = useTeamStats();
  const totalChants = stats?.reduce((n, t) => n + t.chantCount, 0) ?? 0;
  const totalFans = stats?.reduce((n, t) => n + t.fanCount, 0) ?? 0;

  return (
    <div className="space-y-14">
      <section className="grid items-stretch gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center py-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-pitch">
            World Cup 2026 · Solana devnet
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
            The pulse of
            <br />
            World Cup passion,
            <br />
            <span className="text-pitch glow-text">on-chain.</span>
          </h1>
          <p className="mt-5 max-w-lg text-grass">
            Mint your Fan Card, flood the wall with chants, lock score
            predictions before kickoff — and drag your fanbase to the top of
            the loudest leaderboard on the planet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/card"
              className="rounded-full bg-pitch px-7 py-3 font-semibold text-night transition hover:bg-[#33ff9f]"
            >
              Mint your Fan Card
            </Link>
            <Link
              href="/chants"
              className="rounded-full border border-edge px-7 py-3 font-semibold text-chalk transition hover:border-pitch/50 hover:text-pitch"
            >
              Hear the chants
            </Link>
          </div>

          <div className="mt-10 flex gap-10">
            <div>
              <CountUp
                value={totalChants}
                className="font-display text-4xl font-bold tabular-nums"
              />
              <p className="text-xs uppercase tracking-widest text-grass">
                Chants posted
              </p>
            </div>
            <div>
              <CountUp
                value={totalFans}
                className="font-display text-4xl font-bold tabular-nums"
              />
              <p className="text-xs uppercase tracking-widest text-grass">
                Fans registered
              </p>
            </div>
            <div>
              <CountUp
                value={stats?.length ?? 0}
                className="font-display text-4xl font-bold tabular-nums"
              />
              <p className="text-xs uppercase tracking-widest text-grass">
                Fanbases live
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-[420px]">
          <ChantTicker />
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide">
            Loudest fanbases
          </h2>
          <Link
            href="/leaderboard"
            className="text-sm text-pitch underline-offset-4 hover:underline"
          >
            Full leaderboard →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {stats === null ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-40" />
            ))
          ) : stats.length === 0 ? (
            <div className="panel col-span-full px-6 py-10 text-center text-sm text-grass">
              The leaderboard is wide open. First fanbase to register takes the
              top spot.
            </div>
          ) : (
            stats.slice(0, 3).map((t, i) => {
              const team = getTeam(t.code);
              return (
                <div
                  key={t.code}
                  className="panel relative overflow-hidden p-5 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(280px 140px at 85% 0%, ${team.primary}, transparent 70%)`,
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{medals[i]}</span>
                      <span className="text-3xl">{team.flag}</span>
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold uppercase tracking-wide">
                      {team.name}
                    </p>
                    <div className="mt-2 flex gap-5 text-sm text-grass">
                      <span>
                        <span className="font-semibold text-chalk tabular-nums">
                          {t.chantCount.toLocaleString()}
                        </span>{" "}
                        chants
                      </span>
                      <span>
                        <span className="font-semibold text-chalk tabular-nums">
                          {t.points.toLocaleString()}
                        </span>{" "}
                        pts
                      </span>
                      <span>
                        <span className="font-semibold text-chalk tabular-nums">
                          {t.fanCount.toLocaleString()}
                        </span>{" "}
                        fans
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
