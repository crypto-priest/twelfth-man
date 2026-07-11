"use client";

import Link from "next/link";
import { useFanCard } from "@/hooks/use-fan-card";
import { useMatches } from "@/hooks/use-matches";
import { useTeamStats } from "@/hooks/use-team-stats";
import { useLiveScores } from "@/hooks/use-live-scores";
import { getTeam } from "@/lib/teams";
import type { FanCard, TeamStats } from "@/lib/fanpulse";
import { ChantTicker } from "@/components/chant-ticker";
import { ComposeBox } from "@/components/compose-box";
import { CountUp } from "@/components/count-up";
import { MatchCard } from "@/components/match-card";
import { RegisterPanel } from "@/components/register-panel";
import { SectionTitle } from "@/components/section-title";
import { WalletButton } from "@/components/wallet-button";

const steps = [
  {
    icon: "🎟️",
    title: "Connect your wallet",
    body: "One tap. That's your ticket into the stadium.",
  },
  {
    icon: "🎽",
    title: "Pick your team",
    body: "Get your free Fan Card for the country you back.",
  },
  {
    icon: "📣",
    title: "Cheer & call scores",
    body: "Post chants, predict results, climb the world table.",
  },
];

const medals = ["🥇", "🥈", "🥉"];

function MiniBoard({ stats, myTeam }: { stats: TeamStats[] | null; myTeam?: string }) {
  if (stats === null) return <div className="skeleton h-56" />;
  if (stats.length === 0) {
    return (
      <div className="panel px-5 py-8 text-center text-sm text-grass">
        The board is wide open. One chant puts your country on top.
      </div>
    );
  }
  return (
    <div className="panel overflow-hidden">
      {stats.slice(0, 5).map((t, i) => {
        const team = getTeam(t.code);
        const mine = myTeam === t.code;
        return (
          <div
            key={t.code}
            className={`flex items-center gap-3 border-b border-edge/60 px-4 py-2.5 last:border-0 ${
              mine ? "bg-pitch/[0.07]" : ""
            }`}
            style={mine ? { boxShadow: "inset 3px 0 0 #00ff87" } : undefined}
          >
            <span className="w-6 text-center font-display text-lg font-bold text-grass">
              {medals[i] ?? i + 1}
            </span>
            <span className="text-xl">{team.flag}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
              {team.name}
              {mine && <span className="ml-2 text-xs font-bold text-pitch">You</span>}
            </span>
            <span className="text-sm tabular-nums text-grass">
              {t.chantCount.toLocaleString()} chants
            </span>
            <span className="w-14 text-right font-display text-lg font-bold tabular-nums text-pitch">
              {t.points.toLocaleString()}
            </span>
          </div>
        );
      })}
      <Link
        href="/leaderboard"
        className="block border-t border-edge px-4 py-2.5 text-center text-sm text-pitch transition hover:bg-pitch/5"
      >
        Full leaderboard →
      </Link>
    </div>
  );
}

function PersonalStrip({ fan }: { fan: FanCard }) {
  const team = getTeam(fan.team);
  return (
    <Link
      href="/card"
      className="panel flex items-center gap-4 px-5 py-3.5 transition hover:border-pitch/40"
    >
      <span className="text-3xl">{team.flag}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">You&apos;re backing {team.name}</p>
        <p className="text-xs text-grass">Tap to see your full Fan Card</p>
      </div>
      <div className="text-right">
        <CountUp value={fan.points} className="font-display text-2xl font-bold text-pitch" />
        <p className="text-[11px] uppercase tracking-widest text-grass">Points</p>
      </div>
      <div className="text-right">
        <CountUp value={fan.chantCount} className="font-display text-2xl font-bold" />
        <p className="text-[11px] uppercase tracking-widest text-grass">Chants</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const { fan, loading, connected, refresh } = useFanCard();
  const { matches, predictions, refresh: refreshMatches } = useMatches();
  const stats = useTeamStats();
  const liveScores = useLiveScores();

  const fixtures = (matches ?? []).filter((m) => !m.settled).slice(0, 3);
  const totalChants = stats?.reduce((n, t) => n + t.chantCount, 0) ?? 0;
  const totalFans = stats?.reduce((n, t) => n + t.fanCount, 0) ?? 0;

  const onChanged = () => {
    refreshMatches();
    refresh();
  };

  // the matchday hub: everything a fan needs in one place
  if (connected && (loading || fan)) {
    return (
      <div className="space-y-8">
        {loading || !fan ? (
          <div className="skeleton h-[74px]" />
        ) : (
          <PersonalStrip fan={fan} />
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4 lg:col-start-1">
            <div className="flex items-end justify-between">
              <SectionTitle live>Today&apos;s matches — make your call</SectionTitle>
              <Link
                href="/matches"
                className="text-sm text-pitch underline-offset-4 hover:underline"
              >
                All matches →
              </Link>
            </div>
            {matches === null ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton h-48" />
              ))
            ) : fixtures.length === 0 ? (
              <div className="panel px-5 py-8 text-center text-sm text-grass">
                No matches on the schedule right now. Check back soon.
              </div>
            ) : (
              fixtures.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  prediction={predictions.get(m.id)}
                  fan={fan}
                  live={liveScores.get(`${m.home}-${m.away}`)}
                  onChanged={onChanged}
                />
              ))
            )}
          </section>

          <section className="space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <SectionTitle>Get loud for your team</SectionTitle>
            {fan && (
              <ComposeBox
                fan={fan}
                matches={matches?.filter((m) => !m.settled)}
                onPosted={refresh}
              />
            )}
            <ChantTicker />
          </section>

          <section className="space-y-4 lg:col-start-1">
            <SectionTitle>Loudest fanbases</SectionTitle>
            <MiniBoard stats={stats} myTeam={fan?.team} />
          </section>
        </div>
      </div>
    );
  }

  // first visit: get them a fan card without leaving this page
  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-2xl pt-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-pitch">
          World Cup 2026
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Your team needs your voice.{" "}
          <span className="text-pitch glow-text">Get loud.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-grass">
          Cheer for your country, call the scores before kickoff, and push your
          fans to the top of the world table.
        </p>
        {!connected && (
          <div className="mt-7 flex flex-col items-center gap-3">
            <WalletButton />
            <p className="text-xs text-grass">
              Start here — connecting takes one tap.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-10">
          <div>
            <CountUp
              value={totalChants}
              className="font-display text-3xl font-bold tabular-nums"
            />
            <p className="text-xs uppercase tracking-widest text-grass">Chants</p>
          </div>
          <div>
            <CountUp
              value={totalFans}
              className="font-display text-3xl font-bold tabular-nums"
            />
            <p className="text-xs uppercase tracking-widest text-grass">Fans</p>
          </div>
          <div>
            <CountUp
              value={stats?.length ?? 0}
              className="font-display text-3xl font-bold tabular-nums"
            />
            <p className="text-xs uppercase tracking-widest text-grass">Countries</p>
          </div>
        </div>
      </section>

      {connected && !loading && !fan && (
        <section className="mx-auto max-w-3xl">
          <RegisterPanel onRegistered={refresh} />
        </section>
      )}

      <section id="how-it-works" className="mx-auto max-w-4xl scroll-mt-24">
        <SectionTitle>How it works</SectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => {
            const done = (i === 0 && connected) || (i === 1 && connected && !!fan);
            return (
              <div key={s.title} className="panel flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-lg font-bold ${
                      done ? "bg-pitch text-night" : "bg-pitch/10 text-pitch"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-grass">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl">
        <SectionTitle live>Loudest fanbases right now</SectionTitle>
        <div className="mt-4">
          <MiniBoard stats={stats} />
        </div>
      </section>
    </div>
  );
}
